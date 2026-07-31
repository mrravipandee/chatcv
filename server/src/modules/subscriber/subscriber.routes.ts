import { Router } from "express";
import { subscribeUser } from "./subscriber.controller";
import { subscribeSchema } from "./subscriber.validation";
import { validate } from "../../middlewares/validate.middleware";

const router = Router();

router.post("/subscribe", validate(subscribeSchema), subscribeUser);

export default router;