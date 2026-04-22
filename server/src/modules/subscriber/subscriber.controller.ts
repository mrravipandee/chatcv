import { Request, Response } from "express";
import { addSubscriber } from "./subscriber.service";
import { subscribeSchema } from "./subscriber.validation";

export const subscribeUser = async (req: Request, res: Response) => {
  try {
    const parsed = subscribeSchema.parse(req.body);

    const result = await addSubscriber(parsed.email);

    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};