import express from "express";
import {
  doctorCreate,
  doctors,
  passwordChange,
  tokenTimeIncrease,
} from "./user.controller";
import { authorized } from "../../middleware/middleware";

const router = express.Router();

router.route("/register").post(doctorCreate);
router.route("/token-verify").post(tokenTimeIncrease);
router.route("/change-password").put(authorized(), passwordChange);
router.route("/doctors").get(doctors);

export const userRouter = router;
