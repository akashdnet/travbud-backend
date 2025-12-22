import { z } from "zod";

const createWebReviewValidation = z.object({
    body: z.object({
        rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
        comment: z.string().min(10, "Comment must be at least 10 characters long").max(100, "Comment must be at most 1000 characters long"),
    })
});

const updateWebReviewValidation = z.object({
    body: z.object({
        rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
        comment: z.string().min(10, "Comment must be at least 10 characters long").max(100, "Comment must be at most 1000 characters long"),
    })
});


export const webReviewValidation = {
    createWebReviewValidation,
    updateWebReviewValidation
}