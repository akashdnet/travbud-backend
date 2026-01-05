import { z } from "zod";

const userRegistrationValidation = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Please use a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    bio: z.string().max(100, "Bio cannot exceed 100 characters").optional(),
    about: z.string().optional(),
    photo: z.url().optional(),
    age: z.preprocess((val) => {
        if (typeof val === "string") {
            if (/^\d+$/.test(val)) {
                return Number(val);
            }
            throw new Error("Age must be a number or numeric string");
        }
        return val;
    }, z.number()),
    gender: z.enum(["Male", "Female"]),
    travelInterests: z.array(z.string()).optional(),
    visitedCountries: z.array(z.string()).optional(),
    currentLocation: z.string().optional(),
    contactNumber: z.string().optional(),
    role: z.enum(["user", "guide", "admin"]).optional().default("user"),
    status: z.enum(["active", "blocked"]).optional().default("active"),
    // isVerified: z.boolean().optional().default(false),
});

const userLoginValidation = z.object({
    email: z.email("Please use a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const userUpdateValidation = z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.email("Please use a valid email address").optional(),
    bio: z.string().max(100, "Bio cannot exceed 100 characters").optional(),
    about: z.string().optional(),
    photo: z.url().optional(),
    age: z.preprocess((val) => {
        if (typeof val === "string") {
            if (/^\d+$/.test(val)) {
                return Number(val);
            }
            throw new Error("Age must be a number or numeric string");
        }
        return val;
    }, z.number()),
    gender: z.enum(["Male", "Female"]).optional(),
    travelInterests: z.array(z.string()).optional(),
    visitedCountries: z.array(z.string()).optional(),
    currentLocation: z.string().optional(),
    contactNumber: z.string().optional(),
});


const adminUserUpdateValidation = z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.email("Please use a valid email address").optional(),
    bio: z.string().max(100, "Bio cannot exceed 100 characters").optional(),
    about: z.string().optional(),
    photo: z.url().optional(),
    age: z.preprocess((val) => {
        if (typeof val === "string") {
            if (/^\d+$/.test(val)) {
                return Number(val);
            }
            throw new Error("Age must be a number or numeric string");
        }
        return val;
    }, z.number()),
    gender: z.enum(["Male", "Female"]).optional(),
    role: z.enum(['user', 'guide', 'admin']).optional(),
    status: z.enum(['active', 'blocked']),
    travelInterests: z.array(z.string()).optional(),
    visitedCountries: z.array(z.string()).optional(),
    currentLocation: z.string().optional(),
    contactNumber: z.string().optional(),
});


const userPasswordUpdateValidation = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
});



export const userValidation = {
    userRegistrationValidation,
    userLoginValidation,
    userUpdateValidation,
    userPasswordUpdateValidation,
    adminUserUpdateValidation
}