import express, { Request, Response } from "express";
import cors from "cors";
import { ApplicationRoutes } from "./routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import apiNotFound from "./app/middlewares/apiNotFound";

// config express application.
const app = express();

// parser, cors...
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//  routes..
app.use("/api", ApplicationRoutes);

// testing routes
app.get("/", (req: Request, res: Response) => {
  res.json({
    status: 200,
    success: true,
    message: "Car washing management system . Assignment 3 for boot camp",
  });
});

// global error handle
app.use(globalErrorHandler)
// no route found
app.use(apiNotFound)

export default app;

