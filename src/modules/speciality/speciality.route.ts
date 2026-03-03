import express from "express";
import specialitiController from "./speciality.controller";
import { authorized } from "../../middleware/middleware";
import upload from "../../middleware/multer";

const router = express.Router();

router
  .route("/")
  .post(
    authorized(),
    upload.single("image"),
    specialitiController.createSpecialiti,
  );
router.route("/").get(specialitiController.specialities);
router.route("/:id").delete(specialitiController.deleteSpeciality);

export const specialityRouter = router;
