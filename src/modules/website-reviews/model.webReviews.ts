//model

import mongoose, { Document, Schema } from 'mongoose';

export interface IWebReview extends Document {
    userId: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
}

const WebReviewSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IWebReview>('WebReview', WebReviewSchema);
