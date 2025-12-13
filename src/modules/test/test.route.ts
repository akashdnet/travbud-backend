import { Router } from "express";
import { fileUploader } from "../../middlewares/fileUploader";
import { upload } from "../../middlewares/upload";
import { testController } from "./test.controller";

const router = Router();

router.post("/upload-image", upload.single("image"), testController.uploadTest);
// router.post("/upload-image", fileUploader.upload.single("image"), testController.uploadTest);
router.get("/", testController.getAllTests);
router.get("/:id", testController.getSingleTest);
router.patch("/:id", fileUploader.upload.single("image"), testController.updateTest);
router.delete("/:id", testController.deleteTest);

export const testRoutes = router;