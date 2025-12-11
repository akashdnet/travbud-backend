import { NextFunction, Request, Response } from "express";
import multer from "multer";

/**
 * Middleware to handle Multer-specific errors
 * This prevents "Unexpected end of form" and other multipart parsing errors from crashing the app
 */
export const multerErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof multer.MulterError) {
        // Multer-specific errors
        let message = "File upload error";
        let statusCode = 400;

        console.error("❌ Multer Error:", {
            code: err.code,
            message: err.message,
            field: err.field,
        });

        switch (err.code) {
            case "LIMIT_FILE_SIZE":
                message = "File size is too large. Maximum size is 10MB.";
                break;
            case "LIMIT_FILE_COUNT":
                message = "Too many files. Maximum is 10 files.";
                break;
            case "LIMIT_UNEXPECTED_FILE":
                message = "Unexpected field in form data.";
                break;
            case "LIMIT_FIELD_KEY":
                message = "Field name is too long.";
                break;
            case "LIMIT_FIELD_VALUE":
                message = "Field value is too long.";
                break;
            case "LIMIT_FIELD_COUNT":
                message = "Too many fields.";
                break;
            case "LIMIT_PART_COUNT":
                message = "Too many parts in multipart data.";
                break;
            default:
                message = `File upload error: ${err.message}`;
        }

        return res.status(statusCode).json({
            success: false,
            message,
            error: err.code,
        });
    }

    // Handle busboy/multipart stream errors
    if (err.message && err.message.includes("Unexpected end of form")) {
        console.error("❌ Upload Interrupted:", {
            message: err.message,
            contentType: req.headers['content-type'],
            contentLength: req.headers['content-length'],
            method: req.method,
            url: req.url,
        });

        return res.status(400).json({
            success: false,
            message: "File upload was interrupted. Please try again.",
            error: "UPLOAD_INTERRUPTED",
        });
    }

    // If it's not a multer error, pass to the next error handler
    next(err);
};
