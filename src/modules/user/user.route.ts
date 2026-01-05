import { Router } from "express";
import authGuard from "../../middlewares/auth";
import { upload } from "../../middlewares/upload";
import { validateRequest } from "../../utils/validationRequest";
import { userController } from "./user.controller";
import { userValidation } from "./user.validation";




const router = Router();



// user routes 
router.post("/register", upload.single('photo'), validateRequest(userValidation.userRegistrationValidation), userController.createUser);
router.get("/me", authGuard("user", "guide", "admin"), userController.getSingleUser);
router.patch("/update/me", upload.single('photo'), validateRequest(userValidation.userUpdateValidation), authGuard("user", "guide", "admin"), userController.updateUser);
router.delete("/me", authGuard("user", "guide", "admin"), userController.deleteUser);


// admin routes 
router.get("/all-users", authGuard("admin"), userController.getAllUsers);
router.get("/:id", userController.getSingleUser);
router.patch("/update/:id", upload.single('photo'), validateRequest(userValidation.adminUserUpdateValidation), authGuard("admin"), userController.updateUser);
router.delete("/:id", authGuard("admin"), userController.deleteUser);







export const userRoutes = router;
