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
