import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from "../../utils/statusCodes";
import { userService } from "./user.service";

import { deleteCloudinaryImage } from "../../middlewares/upload";

const createUser = catchAsync(async (req: Request, res: Response) => {
    try {
        const result = await userService.createUser(req.body, req.file?.path!);

        sendResponse(res, {
            statusCode: statusCode.CREATED,
            success: true,
            message: "User created successfully",
            data: result,
        });
    } catch (error) {
        if (req.file) {
            await deleteCloudinaryImage(req.file.path);
        }
        throw error;
    }
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const queryParams = {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        search: req.query.search as string,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
        role: req.query.role as string,
        status: req.query.status as string,
        gender: req.query.gender as string,
        minAge: req.query.minAge ? Number(req.query.minAge) : undefined,
        maxAge: req.query.maxAge ? Number(req.query.maxAge) : undefined,
    };

    const result = await userService.getAllUsers(queryParams);
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "Users retrieved successfully",
        data: result,
    });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id || (req as any).user?.id;
    const result = await userService.getSingleUser(id);
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "User retrieved successfully",
        data: result,
    });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
    try {
        const id = req.params.id || (req as any).user?.id;
        const result = await userService.updateUser(id, req.body, req.file?.path!);
        sendResponse(res, {
            statusCode: statusCode.OK,
            success: true,
            message: "User updated successfully",
            data: result,
        });
    } catch (error) {
        if (req.file) {
            await deleteCloudinaryImage(req.file.path);
        }
        throw error;
    }
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id || (req as any).user?.id;
    const result = await userService.deleteUser(id);
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "User deleted successfully",
        data: result,
    });
});

const getProfileOverview = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await userService.getProfileOverview(user.id, user.role);
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "Profile overview retrieved successfully",
        data: result,
    });
});

export const userController = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
    getProfileOverview
};
