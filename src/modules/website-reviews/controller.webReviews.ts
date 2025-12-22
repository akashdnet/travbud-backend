import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from "../../utils/statusCodes";
import { webReviewService } from "./service.webReviews";

const createWebReview = catchAsync(async (req: Request, res: Response) => {

    const userId = (req as any).user.id;
    const payload = req.body;
    payload.userId = userId;

    const result = await webReviewService.createWebReview(payload);
    sendResponse(res, {
        statusCode: statusCode.CREATED,
        success: true,
        message: "Web review created successfully",
        data: result,
    });
});





const updateWebReview = catchAsync(async (req: Request, res: Response) => {

    const userId = (req as any).user.id;
    const payload = req.body; // {id(tripId): string, rating: number, comment: string}

    const result = await webReviewService.updateWebReview(userId, payload);
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "Web review updated successfully",
        data: result,
    });
})


const deleteWebReview = catchAsync(async (req: Request, res: Response) => {

    const userId = (req as any).user.id;
    const reviewId = req.params.id;
    const result = await webReviewService.deleteWebReview(userId, reviewId);
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "Web review deleted successfully",
        data: result,
    });
})


const getAllWebReviews = catchAsync(async (req: Request, res: Response) => {
    const limit: number = Number(req.query.limit) || 4;
    const result = await webReviewService.getAllWebReviews(limit);
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "Web reviews retrieved successfully",
        data: result,
    });
})


const getSingleWebReview = catchAsync(async (req: Request, res: Response) => {

    const reviewId = req.params.id;
    const result = await webReviewService.getSingleWebReview(reviewId);
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "Web review retrieved successfully",
        data: result,
    });
})

export const webReviewController = {
    createWebReview,
    updateWebReview,
    deleteWebReview,
    getAllWebReviews,
    getSingleWebReview
}