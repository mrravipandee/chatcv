import express from "express";
import cors from "cors";
import subscriberRoutes from "./modules/subscriber/subscriber.routes";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", subscriberRoutes);