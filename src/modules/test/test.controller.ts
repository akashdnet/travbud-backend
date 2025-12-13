import { Request, Response } from "express";
import { deleteCloudinaryImage } from "../../config/cloudinary";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from "../../utils/statusCodes";
import { testService } from "./test.service";

const uploadTest = catchAsync(async (req: Request, res: Response) => {
    try {

        console.log(`
            
            
            
            
            
            
            
            
            
            
            
            
            `, req.body.data, req.file?.path, "req.body.data, req.file?.path")
        const result = await testService.uploadTest(req.body.title, req.file?.path);

        sendResponse(res, {
            statusCode: statusCode.CREATED,
            success: true,
            message: "Test created successfully",
            data: result,
        });
    } catch (error) {
        if (req.file) {
            await deleteCloudinaryImage(req.file.path);
        }
        throw error;
    }
});

const getAllTests = catchAsync(async (req: Request, res: Response) => {
    const result = await testService.getAllTests();
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "Tests retrieved successfully",
        data: result,
    });
});

const getSingleTest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await testService.getSingleTest(id);
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "Test retrieved successfully",
        data: result,
    });
});

const updateTest = catchAsync(async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await testService.updateTest(id, req.body, req.file?.path);
        sendResponse(res, {
            statusCode: statusCode.OK,
            success: true,
            message: "Test updated successfully",
            data: result,
        });
    } catch (error) {
        if (req.file) {
            await deleteCloudinaryImage(req.file.path);
        }
        throw error;
    }
});

const deleteTest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await testService.deleteTest(id);
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "Test deleted successfully",
        data: result,
    });
});

export const testController = {
    uploadTest,
    getAllTests,
    getSingleTest,
    updateTest,
    deleteTest,
};