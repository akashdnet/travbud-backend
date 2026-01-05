import mongoose from "mongoose";

export interface IUser {
    _id?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    bio?: string;
    about?: string;
    photo?: string;
    age: number;
    gender: 'Male' | 'Female';
    travelInterests?: string[];
    visitedCountries?: string[];
    currentLocation?: string | null;
    contactNumber?: string;
    role?: 'user' | 'guide' | 'admin';
    status?: 'active' | 'blocked';
    isVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUserMethods {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserModel = mongoose.Model<IUser, {}, IUserMethods>;
