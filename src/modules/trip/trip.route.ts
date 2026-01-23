import { Router } from "express";
import authGuard from "../../middlewares/auth";
import { upload } from "../../middlewares/upload";
import { validateRequest } from "../../utils/validationRequest";
import { tripController } from "./trip.controller";
import { tripValidation } from "./trip.validation";

const router = Router();

router.post("/register", authGuard('guide'), upload.array("photos", 10), validateRequest(tripValidation.tripRegistrationValidation), tripController.createTrip);
router.get("/all-my-trips", authGuard('user', 'guide'), tripController.getAllMyTrips);
router.patch("/update/:id", authGuard('guide'), upload.array("photos", 10), validateRequest(tripValidation.tripUpdateValidation), tripController.updateTrip);
router.post("/approve", authGuard('guide'), tripController.approveJoinRequest);
router.delete("/:id", authGuard('guide'), tripController.deleteTrip);

router.get("/all-my-join-requests", authGuard('user'), tripController.getAllJoinRequests);
router.post("/request/:tripId", authGuard('user', 'admin'), tripController.requestToJoinTrip);
router.patch("/cancel/:id", authGuard('user'), tripController.cancelJoinRequest);

router.get("/admin/all-trips", tripController.getAllTrips);
router.patch("/admin/update/:id", authGuard('admin'), upload.array("photos", 10), validateRequest(tripValidation.tripUpdateValidation), tripController.updateTrip);
router.get("/admin/:id", tripController.getSingleTrip);
router.delete("/admin/:id", authGuard('admin'), tripController.deleteTrip);

export const tripRoutes = router;
