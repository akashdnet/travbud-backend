import { Schema, model } from "mongoose";
import { ITest } from "./test.interface";

const testSchema = new Schema<ITest>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        photo: {
            type: String,
            required: [true, "Photo URL is required"],
        },
    },
    {
        timestamps: true,
    }
);

export const Test = model<ITest>("Test", testSchema);
