import { Router } from "express";
import authGuard from "../../middlewares/auth";
import { fileUploader } from "../../middlewares/fileUploader";
import { validateRequest } from "../../utils/validationRequest";
import { userController } from "./user.controller";
import { userValidation } from "./user.validation";




const router = Router();



// user routes 
router.post("/register", fileUploader.upload.single('image'), validateRequest(userValidation.userRegistrationValidation), userController.createUser);
router.get("/me", authGuard("admin", "user"), userController.getSingleUser);
router.patch("/update/me", fileUploader.upload.single('image'), validateRequest(userValidation.userUpdateValidation), authGuard("admin", "user"), userController.updateUser);
router.delete("/me", authGuard("user"), userController.deleteUser);


// admin routes 
router.get("/all-users", authGuard("admin"), userController.getAllUsers);
router.get("/:id", userController.getSingleUser);
router.patch("/update/:id", fileUploader.upload.single('image'), validateRequest(userValidation.adminUserUpdateValidation), authGuard("admin"), userController.updateUser);
router.delete("/:id", authGuard("admin"), userController.deleteUser);







export const userRoutes = router;
