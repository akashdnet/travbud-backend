import Trip from "../trip/trip.model";
import modelWebReviews from "../website-reviews/model.webReviews";

const fetchHome = async () => {

    const trips = await Trip.find().limit(4);
    const reviews = await modelWebReviews.find().limit(3).populate('userId', 'name photo email rating');


    return { trips, reviews };
}






export const explorerService = {
    fetchHome
}