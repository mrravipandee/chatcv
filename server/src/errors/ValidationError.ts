import { AppError } from "./AppError";

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export class ValidationError extends AppError {
  public readonly details?: ValidationErrorDetail[];

  constructor(message: string = "Validation failed", details?: ValidationErrorDetail[]) {
    super(400, "VALIDATION_ERROR", message);
    this.details = details;
  }
}
