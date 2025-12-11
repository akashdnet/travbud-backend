import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import User from "../user/user.model";
import { ITrip } from "./trip.interface";
import Trip from "./trip.model";

const createTrip = async (userId: string, payload: ITrip, photoUrls: string[] = []): Promise<ITrip> => {
    payload.userId = new mongoose.Types.ObjectId(userId);
    payload.participants = {
        pending: [],
        approved: []
    };

    if (photoUrls.length > 0) {
        payload.photos = photoUrls;
    }

    const user = await User.findById(userId);
    if (user?.status === 'blocked') {
        throw new AppError(404, "This user is blocked. You can't create a trip.");
    }

    // find user trips
    const userTrips = await Trip.find({ userId });

    if (userTrips.length >= 5 && user?.isVerified === false) {
        throw new AppError(404, "Become a verified user to create more than 5 trips.");
    }






    const result = await Trip.create(payload);
    return result as unknown as ITrip;
};

interface TripQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: string;
    minBudget?: number;
    maxBudget?: number;
    travelType?: string;
    startDate?: string;
    endDate?: string;
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

const getAllTrips = async (queryParams: TripQueryParams): Promise<PaginatedResponse<ITrip>> => {
    const {
        page = 1,
        limit = 3,
        search = '',
        sortBy = 'createdAt',
        sortOrder = 'desc',
        status,
        minBudget,
        maxBudget,
        travelType,
        startDate,
        endDate
    } = queryParams;

    // Build query
    const query: any = {};

    // Search in destination and description
    if (search) {
        query.$or = [
            { destination: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    // Filter by status
    if (status) {
        query.status = status;
    }

    // Filter by budget range
    if (minBudget !== undefined || maxBudget !== undefined) {
        query.budget = {};
        if (minBudget !== undefined) {
            query.budget.$gte = minBudget;
        }
        if (maxBudget !== undefined) {
            query.budget.$lte = maxBudget;
        }
    }

    // Filter by travel type
    if (travelType) {
        const types = travelType.split(',').map(t => t.trim());
        query.travelTypes = { $in: types };
    }

    // Filter by date range
    if (startDate) {
        query.startDate = { $gte: new Date(startDate) };
    }
    if (endDate) {
        query.endDate = { $lte: new Date(endDate) };
    }

    // Pagination
    const skip = (page - 1) * limit;
    const limitNum = Math.min(limit, 100); // Max 100 items per page

    // Sorting
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [items, total] = await Promise.all([
        Trip.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum)
            .populate('userId', 'name email photo'),
        Trip.countDocuments(query)
    ]);

    return {
        items: items as unknown as ITrip[],
        pagination: {
            total,
            page,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum)
        }
    };
};

const getAllMyTrips = async (userId: string, queryParams: TripQueryParams): Promise<PaginatedResponse<ITrip>> => {
    const {
        page = 1,
        limit = 3,
        search = '',
        sortBy = 'createdAt',
        sortOrder = 'desc',
        status,
        minBudget,
        maxBudget,
        travelType,
        startDate,
        endDate
    } = queryParams;

    // Build query with userId filter
    const query: any = { userId };

    // Search in destination and description
    if (search) {
        query.$or = [
            { destination: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    // Filter by status
    if (status) {
        query.status = status;
    }

    // Filter by budget range
    if (minBudget !== undefined || maxBudget !== undefined) {
        query.budget = {};
        if (minBudget !== undefined) {
            query.budget.$gte = minBudget;
        }
        if (maxBudget !== undefined) {
            query.budget.$lte = maxBudget;
        }
    }

    // Filter by travel type
    if (travelType) {
        const types = travelType.split(',').map(t => t.trim());
        query.travelTypes = { $in: types };
    }

    // Filter by date range
    if (startDate) {
        query.startDate = { $gte: new Date(startDate) };
    }
    if (endDate) {
        query.endDate = { $lte: new Date(endDate) };
    }

    // Pagination
    const skip = (page - 1) * limit;
    const limitNum = Math.min(limit, 100); // Max 100 items per page

    // Sorting
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [items, total] = await Promise.all([
        Trip.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum)
            .populate('participants.pending', 'name email _id') //add id
            .populate('participants.approved', 'name email _id'),
        Trip.countDocuments(query)
    ]);

    return {
        items: items as unknown as ITrip[],
        pagination: {
            total,
            page,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum)
        }
    };
};

const getSingleTrip = async (id: string): Promise<ITrip | null> => {
    const result = await Trip.findById(id).populate('userId');
    if (!result) {
        throw new AppError(404, "No Trip found with this id. ");
    }
    return result as unknown as ITrip;
};

const updateTrip = async (id: string, payload: Partial<ITrip>, userId?: string, photoUrls: string[] = []): Promise<ITrip | null> => {
    const trip = await Trip.findById(id);
    if (!trip) {
        // If we're rejecting here, we should ideally handle image cleanup in controller catch, 
        // which we are doing.
        throw new AppError(404, "No Trip found with this id.");
    }

    if (userId && trip.userId.toString() !== userId) {
        throw new AppError(403, "You are not authorized to update this trip");
    }

    if (photoUrls.length > 0) {
        payload.photos = photoUrls;
    }

    const result = await Trip.findByIdAndUpdate(id, payload, { new: true });
    return result as unknown as ITrip;
};

const deleteTrip = async (id: string, userId?: string): Promise<ITrip | null> => {
    const trip = await Trip.findById(id);
    if (!trip) {
        throw new AppError(404, "No Trip found with this id.");
    }

    if (userId && trip.userId.toString() !== userId) {
        throw new AppError(403, "You are not authorized to delete this trip");
    }

    const result = await Trip.findByIdAndDelete(id);
    return result as unknown as ITrip;
};

const requestToJoinTrip = async (tripId: string, userId: string): Promise<ITrip | null> => {


    const user = await User.findById(userId);
    if (user?.status === 'blocked') {
        throw new AppError(404, "This user is blocked. You can't join a trip.");
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
        throw new AppError(404, "Trip not found");
    }

    if (!trip.participants) {
        trip.participants = {
            pending: [],
            approved: []
        };
    }

    const isPending = trip.participants.pending.some(id => id.toString() === userId);
    const isApproved = trip.participants.approved.some(id => id.toString() === userId);

    if (isPending || isApproved) {
        throw new AppError(400, "User has already requested or is part of this trip");
    }

    trip.participants.pending.push(new mongoose.Types.ObjectId(userId));
    await trip.save();
    return trip as unknown as ITrip;
};

const getAllJoinRequests = async (userId: string): Promise<ITrip[]> => {
    const result = await Trip.find({
        "participants.pending": userId
    });
    return result as unknown as ITrip[];
};

const cancelJoinRequest = async (tripId: string, userId: string): Promise<ITrip | null> => {
    const trip = await Trip.findById(tripId);
    if (!trip) {
        throw new AppError(404, "Trip not found");
    }

    if (!trip.participants) {
        throw new AppError(404, "No participants found for this trip");
    }

    const isPendingIndex = trip.participants.pending.findIndex(id => id.toString() === userId);

    if (isPendingIndex === -1) {
        throw new AppError(404, "You do not have a pending request for this trip");
    }

    trip.participants.pending.splice(isPendingIndex, 1);
    await trip.save();
    return trip as unknown as ITrip;
};

const approveJoinRequest = async (tripId: string, creatorId: string, participantId: string): Promise<ITrip | null> => {




    const trip = await Trip.findById(tripId);
    if (!trip) {
        throw new AppError(404, "Trip not found");
    }

    if (!trip.participants) {
        throw new AppError(404, "No participants found for this trip");
    }




    console.log(`
        
        
        
        
        
        
        
        `)

    console.log(trip.participants.pending[0].toString(), participantId, "compare ")

    const pendingUser = trip.participants.pending.find(id => id.toString() === participantId);

    if (!pendingUser) {
        throw new AppError(404, "You do not have a pending request for this trip");
    }

    // Remove from pending list
    trip.participants.pending = trip.participants.pending.filter(id => id.toString() !== participantId);

    // Add to approved list
    trip.participants.approved.push(new mongoose.Types.ObjectId(participantId));

    await trip.save();
    return trip as unknown as ITrip;


};

export const tripService = {
    createTrip,
    getAllTrips,
    getAllMyTrips,
    getSingleTrip,
    updateTrip,
    deleteTrip,
    requestToJoinTrip,
    getAllJoinRequests,
    cancelJoinRequest,
    approveJoinRequest,
};
