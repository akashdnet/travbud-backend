import { z } from "zod";

// Trip Registration Validation
const tripRegistrationValidation = z.object(
    {
        name: z.string().min(1, { message: "Tour name is required" }).max(100,
            { message: "Tour name cannot exceed 100 characters" }),
        description: z.string().min(1, { message: "Description is required" }).max(2000, { message: "Description cannot exceed 2000 characters" }),
        price: z.preprocess((val) => { if (typeof val === "string" && /^\d+(\.\d+)?$/.test(val)) { return Number(val); } return val; }, z.number().min(0, { message: "Price cannot be negative" })),
        days: z.preprocess((val) => { if (typeof val === "string" && /^\d+$/.test(val)) { return Number(val); } return val; }, z.number().min(1, { message: "Tour must be at least 1 day" })),
        image: z.string().url({ message: "Main image URL must be valid" }),
        location: z.string().min(1, { message: "Location is required" }),
        startDate: z.preprocess((val) => (val instanceof Date ? val : new Date(val as string)), z.date("Start date is required")),
        endDate: z.preprocess((val) => (val instanceof Date ? val : new Date(val as string)), z.date("End date is required")),
        // guide: z.string().min(1, { message: "Guide (User ID) is required" }),
        participants: z.object({ pending: z.array(z.string()).default([]), approved: z.array(z.string()).default([]), }).default({ pending: [], approved: [] }),
        itinerary: z.array(z.string()).min(1, { message: "Itinerary must contain at least one day" }),
        highlights: z.array(z.string()).min(1, { message: "Highlights are required" }),
        inclusions: z.array(z.string()).min(1, { message: "Inclusions are required" }),
        exclusions: z.array(z.string()).min(1, { message: "Exclusions are required" }),
        difficulty: z.enum(["Easy", "Moderate", "Challenging", "Moderate to Challenging"], { message: "Difficulty level is required" }),
        groupSize: z.preprocess((val) => { if (typeof val === "string" && /^\d+$/.test(val)) { return Number(val); } return val; }, z.number().min(1, { message: "Group size must be at least 1" })),
        faq: z.array(z.object({ q: z.string().min(1).max(300), a: z.string().min(1).max(1000), })).default([]),
        status: z.enum(["Open", "Full", "Completed"]).default("Open"),
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
