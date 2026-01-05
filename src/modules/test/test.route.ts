import { Router } from "express";
import { upload } from "../../middlewares/upload";
import { testController } from "./test.controller";

const router = Router();

router.post("/upload-image", upload.single("photo"), testController.uploadTest);
router.get("/", testController.getAllTests);
router.get("/:id", testController.getSingleTest);
router.patch("/:id", upload.single("photo"), testController.updateTest);
router.delete("/:id", testController.deleteTest);

export const testRoutes = router;