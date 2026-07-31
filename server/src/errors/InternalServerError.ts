import { AppError } from "./AppError";

export class InternalServerError extends AppError {
  constructor(message: string = "Internal server error") {
    super(500, "INTERNAL_SERVER_ERROR", message, false);
  }
}
