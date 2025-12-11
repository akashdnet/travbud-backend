import { Request, Response } from "express";
import path from "path";
import { catchAsync } from "../../utils/catchAsync";



const getAllPost = catchAsync(async (req: Request, res: Response) => {

    res.sendFile(path.join(__dirname, "posts.json"));

});








export const TestControllers = {
    getAllPost,
};