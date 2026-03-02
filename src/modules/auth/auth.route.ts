import express from "express";
import { loginPatient, registerPatient, verifyOtp } from "./auth.controller";

const router = express.Router();

router.route("/register").post(registerPatient);
router.route("/login").post(loginPatient);
router.route("/verifyOtp").post(verifyOtp);

export const authRouter = router;
