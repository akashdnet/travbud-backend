import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { envList } from "../config/envList";
import AppError from "../errors/AppError";

const globalErrorHandler = async (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (envList.NODE_ENV === "development") {
        console.error("❌ Global Error:", err);
    }

    let statusCode = 500;
    let message = "Something Went Wrong!";

    // ✅ Custom AppError
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // ✅ Zod validation error
    else if (err instanceof ZodError) {
        statusCode = 400;
        message = "Validation failed";
        return res.status(statusCode).json({
            success: false,
            message,
            errors: err.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }

    // ✅ Mongo duplicate key error
    else if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyPattern)[0];
        const value = err.keyValue[field];
        message = `Duplicate value for ${field}: "${value}". Please use a different ${field}.`;
    }

    // ✅ JWT errors
    else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid Access Token!";
    } else if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token Expired!";
    }

    // ✅ Generic Error
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        message,
        stack: envList.NODE_ENV === "development" ? err.stack : null,
    });
};

export default globalErrorHandler;
