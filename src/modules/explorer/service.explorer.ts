import Trip from "../trip/trip.model";
import modelWebReviews from "../website-reviews/model.webReviews";
import { Subscribe } from "./model.explorer";

const fetchHome = async () => {

    const trips = await Trip.find().limit(4);
    const reviews = await modelWebReviews.find().limit(3).populate('userId', 'name photo email rating');


    return { trips, reviews };
}

const subscribe = async (email: string) => {
    // check email is already subscribed
    const isSubscribed = await Subscribe.findOne({ email });
    if (isSubscribed) {
        return {
            message: "You are already subscribed",
        };
    }
    const result = await Subscribe.create({ email });
    if (!result) {
        throw new Error("Failed to subscribe");
    }
    return {
        message: "Subscribed successfully",
    };
}




export const explorerService = {
    fetchHome,
    subscribe
}