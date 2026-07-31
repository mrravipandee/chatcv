import { AppError } from "./AppError";

export class ConflictError extends AppError {
  constructor(message: string = "Resource conflict occurred") {
    super(409, "CONFLICT_ERROR", message);
  }
}
