import { Subscriber } from "./subscriber.model";
import { sendWelcomeEmail } from "../email/email.service";

export const addSubscriber = async (email: string) => {
    const existing = await Subscriber.findOne({ email });

    if (existing) {
        return { message: "Already subscribed" };
    }

    const subscriber = await Subscriber.create({ email });

    console.log(`[SUBSCRIBER] New subscriber created: ${email}, triggering email...`);
    
    // async email (non-blocking)
    sendWelcomeEmail(email).catch((error) => {
        console.error(`[SUBSCRIBER] Email error:`, error.message);
    });

    return {
        message: "Subscribed successfully",
        data: subscriber,
    };
};