import express, { Application } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { specialityRouter } from "./modules/speciality/speciality.route";
import { authRouter } from "./modules/auth/auth.route";
import { userRouter } from "./modules/user/user.route";
import { notFound } from "./middleware/notFound";

const app: Application = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/speciality", specialityRouter);

// errorMiddleware shoud be last position
app.use(errorMiddleware);
app.use(notFound);
export default app;
