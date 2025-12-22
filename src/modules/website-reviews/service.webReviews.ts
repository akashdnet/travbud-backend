import modelWebReviews from "./model.webReviews";

const createWebReview = async (payload: any) => {
    const result = await modelWebReviews.create(payload);
    if (!result) {
        throw new Error("Failed to create web review");
    }
    return result;
}


const updateWebReview = async (userId: string, payload: { id: string, rating: number, comment: string }) => {

    // fist find is user own the review with user id and review id
    const review = await modelWebReviews.findOne({ userId, _id: payload.id });
    if (!review) {
        throw new Error("User does not own this review or review not found");
    }

    // update the review
    const result = await modelWebReviews.findOneAndUpdate({ userId }, payload, { new: true });
    if (!result) {
        throw new Error("Failed to update web review");
    }
    return result;
}






const deleteWebReview = async (userId: string, reviewId: string) => {


    // fist find is user own the review with user id and review id
    const review = await modelWebReviews.findOne({ userId, _id: reviewId });
    if (!review) {
        throw new Error("User does not own this review or review not found");
    }
    const result = await modelWebReviews.findByIdAndDelete(reviewId);
    if (!result) {
        throw new Error("Failed to delete web review");
    }
    return result;
}


const getSingleWebReview = async (id: string) => {
    const result = await modelWebReviews.findById(id);
    if (!result) {
        throw new Error("Failed to get web review");
    }
    return result;
}


const getAllWebReviews = async (limit: number) => {

    const result = await modelWebReviews.find().populate("userId", 'name email photo reviews').limit(limit);
    if (!result) {
        throw new Error("Failed to get all web reviews");
    }
    return result;
}


export const webReviewService = {
    createWebReview,
    updateWebReview,
    deleteWebReview,
    getSingleWebReview,
    getAllWebReviews
}