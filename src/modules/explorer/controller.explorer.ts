import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from "../../utils/statusCodes";
import { explorerService } from "./service.explorer";
;

const fetchHome = catchAsync(async (req: Request, res: Response) => {

    const result = await explorerService.fetchHome();
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "Home fetched successfully",
        data: result,
    });
});

const subscribe = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
        throw new Error("Email is required");
    }
    const result = await explorerService.subscribe(email);
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: result.message,
        data: [],
    });
});


export const explorerController = {
    fetchHome,
    subscribe
}