import express from "express";
import specialitiController from "./speciality.controller";
import { authorized } from "../../middleware/middleware";

const router = express.Router();

router.route("/").post(authorized(), specialitiController.createSpecialiti);
router.route("/").get(specialitiController.specialities);
router.route("/:id").delete(specialitiController.deleteSpeciality);

export const specialityRouter = router;
