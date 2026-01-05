import AppError from "../../errors/AppError";
import { deleteCloudinaryImage } from "../../middlewares/upload";
import { ITest } from "./test.interface";
import { Test } from "./test.model";

const uploadTest = async (title: string, photoUrl?: string): Promise<ITest> => {

    const payload = {
        title,
        photo: photoUrl,
    }

    const result = await Test.create(payload);
    if (!result) {
        if (photoUrl) {
            await deleteCloudinaryImage(photoUrl)
            console.log("photoUrl deleted");
        };
        throw new AppError(400, "Failed to create Test credential");
    }
    return result;
};

const getAllTests = async (): Promise<ITest[]> => {
    const result = await Test.find();
    return result;
};

const getSingleTest = async (id: string): Promise<ITest | null> => {
    const result = await Test.findById(id);
    if (!result) {
        throw new AppError(404, "Test credential not found");
    }
    return result;
};

const updateTest = async (id: string, payload: Partial<ITest>, photoUrl?: string): Promise<ITest | null> => {
    if (photoUrl) {
        payload.photo = photoUrl;
    }
    const result = await Test.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        if (photoUrl) await deleteCloudinaryImage(photoUrl);
        throw new AppError(404, "Test credential not found to update");
    }
    return result;
};

const deleteTest = async (id: string): Promise<ITest | null> => {
    const result = await Test.findByIdAndDelete(id);
    if (!result) {
        throw new AppError(404, "Test credential not found to delete");
    }
    if (result.photo) {
        await deleteCloudinaryImage(result.photo);
    }
    return result;
};

export const testService = {
    uploadTest,
    getAllTests,
    getSingleTest,
    updateTest,
    deleteTest,
};
