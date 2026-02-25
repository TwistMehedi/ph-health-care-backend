import express from "express";
import { loginPatient, registerPatient } from "./auth.controller";

const router = express.Router();

router.route("/register").post(registerPatient);
router.route("/login").post(loginPatient);

export const authRouter = router;
