import express from "express";
import { doctorCreate, doctors } from "./user.controller";

const router = express.Router();

router.route("/register").post(doctorCreate);
router.route("/doctors").get(doctors);

export const userRouter = router;
