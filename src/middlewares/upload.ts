import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { envList } from "../config/envList";

// Configure Cloudinary
cloudinary.config({
    cloud_name: envList.CLOUDINARY_CLOUD_NAME,
    api_key: envList.CLOUDINARY_API_KEY,
    api_secret: envList.CLOUDINARY_API_SECRET,
});

// Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "travbud",
        allowed_formats: ["jpg", "png", "jpeg", "webp", "gif"],
    } as any,
});

// Multer Upload Instance
export const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
});

// Delete Image from Cloudinary
export const deleteCloudinaryImage = async (url: string) => {
    try {
        const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
        const match = url.match(regex);
        if (match && match[1]) {
            await cloudinary.uploader.destroy(match[1]);
        }
    } catch (error: any) {
        console.error("Cloudinary delete error:", error.message);
    }
};
