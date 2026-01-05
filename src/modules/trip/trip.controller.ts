import { Request, Response } from "express";
import { deleteCloudinaryImage } from "../../middlewares/upload";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from "../../utils/statusCodes";
import { tripService } from "./trip.service";


const createTrip = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    let photoUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
        photoUrls = (req.files as Express.Multer.File[]).map((file) => file.path);
    }

    try {
        const result = await tripService.createTrip(userId, req.body, photoUrls);

        sendResponse(res, {
            statusCode: statusCode.CREATED,
            success: true,
            message: "Trip created successfully",
            data: result,
        });
    } catch (error) {
        if (photoUrls.length > 0) {
            await Promise.all(photoUrls.map((photo) => deleteCloudinaryImage(photo)));
        }
        throw error;
    }
});

const getAllTrips = catchAsync(async (req: Request, res: Response) => {
    const queryParams = {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        search: req.query.search as string,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
        status: req.query.status as string,
        minBudget: req.query.minBudget ? Number(req.query.minBudget) : undefined,
        maxBudget: req.query.maxBudget ? Number(req.query.maxBudget) : undefined,
        travelType: req.query.travelType as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
    };

    const result = await tripService.getAllTrips(queryParams);
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "Trips retrieved successfully",
        data: result,
    });
});

const getAllMyTrips = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    const queryParams = {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        search: req.query.search as string,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
        status: req.query.status as string,
        minBudget: req.query.minBudget ? Number(req.query.minBudget) : undefined,
        maxBudget: req.query.maxBudget ? Number(req.query.maxBudget) : undefined,
        travelType: req.query.travelType as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
    };

    const result = await tripService.getAllMyTrips(userId, queryParams);
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "My trips retrieved successfully",
        data: result,
    });
});

const getSingleTrip = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await tripService.getSingleTrip(id);
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "Trip retrieved successfully",
        data: result,
    });
});

const updateTrip = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const userRole = (req as any).user.role;
    const userId = (req as any).user.id;

    let photoUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
        photoUrls = (req.files as Express.Multer.File[]).map((file) => file.path);
    }


    const serviceUserId = userRole === 'admin' ? undefined : userId;

    try {
        const result = await tripService.updateTrip(id, req.body, serviceUserId, photoUrls);
        sendResponse(res, {
            statusCode: statusCode.OK,
            success: true,
            message: "Trip updated successfully",
            data: result,
        });
    } catch (error) {
        if (photoUrls.length > 0) {
            await Promise.all(photoUrls.map((photo) => deleteCloudinaryImage(photo)));
        }
        throw error;
    }
});

const deleteTrip = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const userRole = (req as any).user.role;
    const userId = (req as any).user.id;

    const serviceUserId = userRole === 'admin' ? undefined : userId;

    const result = await tripService.deleteTrip(id, serviceUserId);
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "Trip deleted successfully",
        data: result,
    });
});

const requestToJoinTrip = catchAsync(async (req: Request, res: Response) => {
    const tripId = req.params.tripId;
    const userId = (req as any).user.id;
    const result = await tripService.requestToJoinTrip(tripId, userId);

    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "Join request sent successfully",
        data: null,
    });
});

const getAllJoinRequests = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const result = await tripService.getAllJoinRequests(userId);

    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "Join requests retrieved successfully",
        data: result,
    });
});

const cancelJoinRequest = catchAsync(async (req: Request, res: Response) => {
    const tripId = req.params.id; // Using params.id as tripId from route
    const userId = (req as any).user.id;
    const result = await tripService.cancelJoinRequest(tripId, userId);

    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "Join request cancelled successfully",
        data: null,
    });
});

const approveJoinRequest = catchAsync(async (req: Request, res: Response) => {
    const creatorId = (req as any).user.id;
    const { tripId, participantId } = req.body; // tripId and userId(participant) from body
    const result = await tripService.approveJoinRequest(tripId, creatorId, participantId);

    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "User join request approved",
        data: null,
    });
});

export const tripController = {
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
