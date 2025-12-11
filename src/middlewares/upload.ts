import { Request } from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";


const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file): Promise<Record<string, string>> => {
        const nameWithoutExt = file.originalname
            .split(".")
            .slice(0, -1)
            .join(".")
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\-]/g, "");

        const extension = file.originalname.split(".").pop();

        const uniqueFileName =
            Math.random().toString(36).substring(2) +
            "-" +
            Date.now() +
            "-" +
            nameWithoutExt;

        return {
            folder: "uploads",
            public_id: uniqueFileName,
        };
    },
});

// File filter to validate file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Only ${allowedMimeTypes.join(', ')} are allowed.`));
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max file size
        files: 10, // Maximum 10 files
        fieldSize: 10 * 1024 * 1024, // 10MB max field size
    }
});