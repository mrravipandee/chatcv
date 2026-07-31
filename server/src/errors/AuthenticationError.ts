import { AppError } from "./AppError";

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed") {
    super(401, "UNAUTHENTICATED", message);
  }
}
