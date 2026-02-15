import express, { Application } from "express";
import morgan from "morgan";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { specialityRouter } from "./modules/speciality/speciality.route";

const app: Application = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/speciality", specialityRouter);

// errorMiddleware shoud be last position
app.use(errorMiddleware);

export default app;
