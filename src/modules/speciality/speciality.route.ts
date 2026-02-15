import express from "express";
import specialitiController from "./speciality.controller";

const router = express.Router();

router.route("/").post(specialitiController.createSpecialiti);
router.route("/").get(specialitiController.specialities);
router.route("/:id").delete(specialitiController.deleteSpeciality);

export const specialityRouter = router;
