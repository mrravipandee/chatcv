import { Router } from "express";
import { subscribeUser } from "./subscriber.controller";

const router = Router();

router.post("/subscribe", subscribeUser);

export default router;