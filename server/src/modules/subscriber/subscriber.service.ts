import { Subscriber, ISubscriber } from "./subscriber.model";
import { sendWelcomeEmail } from "../email/email.service";
import { ConflictError } from "../../errors/ConflictError";

interface AddSubscriberResult {
  message: string;
  data?: ISubscriber;
}

export const addSubscriber = async (email: string): Promise<AddSubscriberResult> => {
  try {
    // Check if email already exists
    const existing = await Subscriber.findOne({ email: email.toLowerCase().trim() });

    if (existing) {
      throw new ConflictError("Email already subscribed");
    }

    // Create new subscriber
    const subscriber = await Subscriber.create({
      email: email.toLowerCase().trim(),
      source: "landing_page",
    });

    console.log(`[SUBSCRIBER] New subscriber created: ${email}`);

    // Send welcome email asynchronously (non-blocking)
    sendWelcomeEmail(email).catch((emailError) => {
      console.error(
        `[SUBSCRIBER] Email sending failed for ${email}:`,
        emailError.message
      );
      // Don't throw - subscription succeeded even if email fails
    });

    return {
      message: "Subscribed successfully! Check your email for updates.",
      data: subscriber,
    };
  } catch (error: any) {
    console.error(`[SUBSCRIBER] Error adding subscriber:`, error.message);
    throw error;
  }
};