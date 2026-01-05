import { Schema, model } from "mongoose";

const subscribeSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Subscribe = model("Subscribe", subscribeSchema);
