import { AppError } from "./AppError";

export class AuthorizationError extends AppError {
  constructor(message: string = "Unauthorized access permission denied") {
    super(403, "UNAUTHORIZED", message);
  }
}
