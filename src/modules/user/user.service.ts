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

    // Build query
    const query: any = {};

    // Search in name, email, and currentLocation
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { currentLocation: { $regex: search, $options: 'i' } }
        ];
    }

    // Filter by role
    if (role) {
        query.role = role;
    }

    // Filter by status
    if (status) {
        query.status = status;
    }

    // Filter by gender
    if (gender) {
        query.gender = gender;
    }

    // Filter by age range
    if (minAge !== undefined || maxAge !== undefined) {
        query.age = {};
        if (minAge !== undefined) {
            query.age.$gte = minAge;
        }
        if (maxAge !== undefined) {
            query.age.$lte = maxAge;
        }
    }

    // Pagination
    const skip = (page - 1) * limit;
    const limitNum = Math.min(limit, 100); // Max 100 items per page

    // Sorting
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
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
        throw new AppError(404, "No User found with this id. ");
    }




    if (result?.role === "admin") {
        const data = {
            profile: result,
            overview: {
                totalPlanTrip: await Trip.countDocuments({ userId: id }),
                totalCompleteTrip: await Trip.countDocuments({ userId: id, endDate: { $lte: new Date() } }),
                upcomingTripList: await Trip.find({ userId: id, endDate: { $gte: new Date() } }).select('-userId -creator -perceptor -joinRequests'),
            }
        }
        return data as any;
    }


    const data = {
        profile: result,
        overview: {
            totalPlanTrip: await Trip.countDocuments({ userId: id }),


            // find number of completed trip
            totalCompleteTrip: await Trip.countDocuments({ userId: id, endDate: { $lte: new Date() } }),

            // find from trip which end date is passed from to day
            upcomingTripList: await Trip.find({ userId: id, endDate: { $gte: new Date() } }).select('-userId -creator -perceptor -joinRequests'),


        }
    }

    return data as any;
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

const deleteUser = async (id: string): Promise<IUser | null> => {
    const result = await User.findByIdAndDelete(id);

    if (!result) {
        throw new AppError(404, "No User found with this id. ");
    }

    await deleteCloudinaryImage(result.photo!);

    return result;
};

export const userService = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
};
