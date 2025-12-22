import mongoose from "mongoose";


export interface ITrip {
    _id?: mongoose.Types.ObjectId;

    userId: mongoose.Types.ObjectId; // Trip creator user ref

    destination: string;
    startDate: Date;
    endDate: Date;

    budget: number;
    travelTypes: string[];

    description: string;

    activities?: string[];
    photos?: string[];

    maxGroupSize: number;

    participants: {
        pending: mongoose.Types.ObjectId[];
        approved: mongoose.Types.ObjectId[];
    };

    status: "Open" | "Full" | "Completed" | "Cancelled";

    createdAt?: Date;
    updatedAt?: Date;
}







export interface TripQueryParams {
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

export interface PaginatedResponse<T> {
    items: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
