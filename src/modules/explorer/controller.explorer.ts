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




export const explorerController = {
    fetchHome
}