import AppError from "../../errors/AppError";
import { deleteCloudinaryImage } from "../../middlewares/upload";
import Trip from "../trip/trip.model";
import { IUser } from "./user.interface";
import User from "./user.model";

const createUser = async (payload: IUser, photoUrl: string): Promise<IUser> => {
    const result = await User.create({ ...payload, photo: photoUrl });
    if (!result) {
        await deleteCloudinaryImage(photoUrl);
        throw new AppError(404, "User not created");
    }
    return result;
};

interface UserQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    role?: string;
    status?: string;
    gender?: string;
    minAge?: number;
    maxAge?: number;
}

interface PaginatedResponse<T> {
    items: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

const getAllUsers = async (queryParams: UserQueryParams): Promise<PaginatedResponse<IUser>> => {
    const {
        page = 1,
        limit = 10,
        search = '',
        sortBy = 'createdAt',
        sortOrder = 'desc',
        role,
        status,
        gender,
        minAge,
        maxAge
    } = queryParams;

    const query: any = {};

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { currentLocation: { $regex: search, $options: 'i' } }
        ];
    }

    if (role) {
        query.role = role;
    }

    if (status) {
        query.status = status;
    }

    if (gender) {
        query.gender = gender;
    }

    if (minAge !== undefined || maxAge !== undefined) {
        query.age = {};
        if (minAge !== undefined) {
            query.age.$gte = minAge;
        }
        if (maxAge !== undefined) {
            query.age.$lte = maxAge;
        }
    }

    const skip = (page - 1) * limit;
    const limitNum = Math.min(limit, 100);

    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [items, total] = await Promise.all([
        User.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum)
            .select('-password'),
        User.countDocuments(query)
    ]);

    return {
        items: items as unknown as IUser[],
        pagination: {
            total,
            page,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum)
        }
    };
};




const getSingleUser = async (id: string): Promise<IUser | null> => {
    const result = await User.findById(id);

    if (!result) {
        throw new AppError(404, "No User found with this id.");
    }

    const overview = {
        totalPlanTrip: await Trip.countDocuments({ userId: id }),
        totalCompleteTrip: await Trip.countDocuments({ userId: id, endDate: { $lte: new Date() } }),
        upcomingTripList: await Trip.find({ userId: id, endDate: { $gte: new Date() } }).select('-userId -creator -perceptor -joinRequests'),
    };

    return {
        profile: result,
        overview
    } as any;
};

const getProfileOverview = async (userId: string, role: string) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

    // Initialize strict response structure
    let responseData = {
        cardStats: {
            totalTours: 0,
            upcoming: 0,
            completed: 0
        },
        chartStats: [] as { name: string; tours: number }[],
        upcomingAdventures: [] as any[],
        recentHistory: [] as any[]
    };

    // Helper to format chart data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formatChartData = (aggResult: any[]) => {
        const statsMap = new Map(aggResult.map(item => [item._id, item.count]));
        return months.map((month, index) => ({
            name: month,
            tours: statsMap.get(index + 1) || 0
        }));
    };

    if (role === 'admin') {
        const totalTours = await Trip.countDocuments({});
        const upcomingCount = await Trip.countDocuments({
            startDate: { $gt: now },
            status: { $in: ['Open', 'Full'] }
        });
        const completedCount = await Trip.countDocuments({
            endDate: { $lt: now }
        });

        const chartAgg = await Trip.aggregate([
            {
                $match: {
                    startDate: { $gte: startOfYear, $lte: endOfYear }
                }
            },
            {
                $group: {
                    _id: { $month: "$startDate" },
                    count: { $sum: 1 }
                }
            }
        ]);

        const upcomingAdventures = await Trip.find({
            $or: [{ "participants.approved": userId }, { guide: userId }],
            startDate: { $gt: now },
            status: { $in: ['Open', 'Full'] }
        })
            .sort({ startDate: 1 })
            .limit(5)
            .select('_id name startDate location status');

        const recentHistory = await Trip.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .select('_id name startDate status');

        responseData = {
            cardStats: {
                totalTours,
                upcoming: upcomingCount,
                completed: completedCount
            },
            chartStats: formatChartData(chartAgg),
            upcomingAdventures: upcomingAdventures.map(t => ({
                id: t._id,
                name: t.name,
                date: t.startDate,
                location: t.location,
                status: t.status
            })),
            recentHistory: recentHistory.map(t => ({
                id: t._id,
                name: t.name,
                date: t.startDate,
                status: t.status
            }))
        };

    } else {
        const isGuide = role === 'guide';

        const baseCriteria = isGuide
            ? {
                $or: [
                    { "participants.pending": userId },
                    { "participants.approved": userId },
                    { guide: userId }
                ]
            }
            : {
                $or: [
                    { "participants.pending": userId },
                    { "participants.approved": userId }
                ]
            };

        const totalTours = await Trip.countDocuments(baseCriteria);

        const upcomingCriteria = isGuide
            ? {
                $or: [{ "participants.approved": userId }, { guide: userId }],
                startDate: { $gt: now },
            }
            : {
                "participants.approved": userId,
                startDate: { $gt: now }
            };
        const upcomingCount = await Trip.countDocuments(upcomingCriteria);

        const completedCriteria = {
            ...baseCriteria,
            endDate: { $lt: now }
        };
        const completedCount = await Trip.countDocuments(completedCriteria);

        const chartAgg = await Trip.aggregate([
            {
                $match: {
                    ...baseCriteria,
                    startDate: { $gte: startOfYear, $lte: endOfYear }
                }
            },
            {
                $group: {
                    _id: { $month: "$startDate" },
                    count: { $sum: 1 }
                }
            }
        ]);

        const upcomingAdventures = await Trip.find(upcomingCriteria)
            .sort({ startDate: 1 })
            .limit(5)
            .select('_id name startDate location status');

        const recentHistory = await Trip.find(baseCriteria)
            .sort({ startDate: -1 })
            .limit(5)
            .select('_id name startDate status');

        responseData = {
            cardStats: {
                totalTours,
                upcoming: upcomingCount,
                completed: completedCount
            },
            chartStats: formatChartData(chartAgg),
            upcomingAdventures: upcomingAdventures.map(t => ({
                id: t._id,
                name: t.name,
                date: t.startDate,
                location: t.location,
                status: t.status
            })),
            recentHistory: recentHistory.map(t => ({
                id: t._id,
                name: t.name,
                date: t.startDate,
                status: t.status
            }))
        };
    }

    return responseData;
};








const deleteUser = async (id: string): Promise<IUser | null> => {
    const result = await User.findByIdAndDelete(id);

    if (!result) {
        throw new AppError(404, "No User found with this id. ");
    }

    await deleteCloudinaryImage(result.photo!);

    return result;
};


const updateUser = async (id: string, payload: Partial<IUser>, photoUrl: string): Promise<IUser | null> => {
    if (photoUrl) {
        payload.photo = photoUrl;
    }

    const result = await User.findByIdAndUpdate(id, payload, { new: true });

    if (!result) {
        await deleteCloudinaryImage(photoUrl);
        throw new AppError(404, "No User found with this id. ");
    }
    return result;
};

export const userService = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
    getProfileOverview
};
