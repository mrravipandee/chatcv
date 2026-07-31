import { AppError } from "./AppError";

export class DatabaseError extends AppError {
  constructor(message: string = "Database query failure") {
    super(500, "DATABASE_ERROR", message, false);
  }
}
