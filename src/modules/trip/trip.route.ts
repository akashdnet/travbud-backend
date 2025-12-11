import { Router } from "express";
import authGuard from "../../middlewares/auth";
import { validateRequest } from "../../utils/validationRequest";
import { tripController } from "./trip.controller";
import { tripValidation } from "./trip.validation";

const router = Router();


// creator, percepent, admin

import { upload } from "../../middlewares/upload";

// creator 
router.post("/register", authGuard('user'), upload.array("photos", 10), validateRequest(tripValidation.tripRegistrationValidation), tripController.createTrip);
router.get("/all-my-trips", authGuard('user'), tripController.getAllMyTrips); //my all trips
router.patch("/update/:id", authGuard('user'), upload.array("photos", 10), validateRequest(tripValidation.tripUpdateValidation), tripController.updateTrip); //update trip that i created
router.post("/approve", authGuard('user'), tripController.approveJoinRequest); //approve perceptor join request i created
router.delete("/:id", authGuard('user'), tripController.deleteTrip); //delete my created trip

//percepent
router.post("/request/:tripId", authGuard('user', 'admin'), tripController.requestToJoinTrip); //request to join trip
router.get("/all-my-join-requests", authGuard('user'), tripController.getAllJoinRequests); //my all join requests
router.patch("/cancel/:id", authGuard('user'), tripController.cancelJoinRequest); //cancel join request


// admin 
router.get("/admin/all-trips", tripController.getAllTrips); // get all trips
router.patch("/admin/update/:id", authGuard('admin'), upload.array("photos", 10), validateRequest(tripValidation.tripUpdateValidation), tripController.updateTrip); //update any trip
router.get("/admin/:id", tripController.getSingleTrip); //get any trip
router.delete("/admin/:id", authGuard('admin'), tripController.deleteTrip); //delete any trip



export const tripRoutes = router;
