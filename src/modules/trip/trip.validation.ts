import { z } from "zod";

// Trip Registration Validation
const tripRegistrationValidation = z.object({
    destination: z.string().min(1, { message: "Destination is required" }),
    startDate: z.union([z.string(), z.date()]).refine(
        (val) => !isNaN(Date.parse(val.toString())),
        { message: "Invalid start date" }
    ),
    endDate: z.union([z.string(), z.date()]).refine(
        (val) => !isNaN(Date.parse(val.toString())),
        { message: "Invalid end date" }
    ),
    budget: z.preprocess((val) => {
        if (typeof val === "string") {
            if (/^\d+$/.test(val)) {
                const newBudget = Number(val);
                if (newBudget > 0) {
                    return newBudget;
                }
                throw new Error("Budget must be more than 0");
            }
            throw new Error("Budget must be a number or numeric string");
        }
        return val;
    }, z.number().min(1, { message: "Budget must be more than 0" })),
    travelType: z.array(z.string()).min(1, { message: "At least one travel type is required" }),
    description: z.string()
        .min(1, { message: "Description is required" })
        .max(2000, { message: "Description cannot exceed 2000 characters" }),
    activities: z.array(z.string()),
    photos: z.array(z.string().url({ message: "Photo must be a valid URL" })).optional(),
    maxGroupSize: z.preprocess((val) => {
        if (typeof val === "string") {
            if (/^\d+$/.test(val)) {
                return Number(val);
            }
            throw new Error("Age must be a number or numeric string");
        }
        return val;
    }, z.number()),
    status: z.enum(["Open", "Full", "Completed", "Cancelled"]).optional().default("Open"),
});

// Trip Update Validation
const tripUpdateValidation = z.object({
    destination: z.string().min(1, { message: "Destination is required" }).optional(),
    startDate: z.union([z.string(), z.date()]).refine(
        (val) => !isNaN(Date.parse(val.toString())),
        { message: "Invalid start date" }
    ),
    endDate: z.union([z.string(), z.date()]).refine(
        (val) => !isNaN(Date.parse(val.toString())),
        { message: "Invalid end date" }
    ),
    budget: z.preprocess((val) => {
        if (typeof val === "string") {
            if (/^\d+$/.test(val)) {
                const newBudget = Number(val);
                if (newBudget > 0) {
                    return newBudget;
                }
                throw new Error("Budget must be more than 0");
            }
            throw new Error("Budget must be a number or numeric string");
        }
        return val;
    }, z.number().min(1, { message: "Budget must be more than 0" })),
    activities: z.array(z.string()),
    description: z.string().max(2000, { message: "Description cannot exceed 2000 characters" }),
    photos: z.array(z.string().url({ message: "Photo must be a valid URL" })).optional(),
    maxGroupSize: z.preprocess((val) => {
        if (typeof val === "string") {
            if (/^\d+$/.test(val)) {
                return Number(val);
            }
            throw new Error("Age must be a number or numeric string");
        }
        return val;
    }, z.number()).optional(),
    status: z.enum(["Open", "Full", "Completed", "Cancelled"]).optional(),
});

export const tripValidation = {
    tripRegistrationValidation,
    tripUpdateValidation,
};
