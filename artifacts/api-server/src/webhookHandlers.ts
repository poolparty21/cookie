import { getStripeSync } from "./stripeClient";
import { sendSaleNotification } from "./notifications";
import { logger } from "./lib/logger";

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        "STRIPE WEBHOOK ERROR: Payload must be a Buffer. " +
        "Received type: " + typeof payload + ". " +
        "This usually means express.json() parsed the body before reaching this handler. " +
        "FIX: Ensure webhook route is registered BEFORE app.use(express.json())."
      );
    }

    // Let stripe-replit-sync verify the signature and sync to DB.
    // If this throws, the signature is invalid — we rethrow so the caller returns 400.
    const sync = await getStripeSync();
    await sync.processWebhook(payload, signature);

    // Signature was valid — safe to parse the raw payload for our own handling.
    // We do this AFTER verification so we never act on unverified data.
    try {
      const event = JSON.parse(payload.toString("utf8")) as {
        type: string;
        data?: {
          object?: Record<string, unknown>;
        };
      };

      await WebhookHandlers.handleEvent(event);
    } catch (err) {
      // Notification errors must never cause the webhook to return 4xx.
      // Stripe would retry indefinitely if we returned an error here.
      logger.warn({ err }, "Post-webhook event handling failed (non-fatal)");
    }
  }

  private static async handleEvent(event: {
    type: string;
    data?: { object?: Record<string, unknown> };
  }): Promise<void> {
    const obj = event.data?.object ?? {};

    logger.info({ eventType: event.type }, "Stripe webhook event received");

    switch (event.type) {
      case "checkout.session.completed": {
        await sendSaleNotification({
          eventType: event.type,
          customerEmail: (obj.customer_email as string) ?? (obj.customer_details as any)?.email ?? null,
          amountTotal: obj.amount_total as number ?? null,
          currency: obj.currency as string ?? null,
          subscriptionId: obj.subscription as string ?? null,
          sessionId: obj.id as string ?? null,
        });
        break;
      }

      case "invoice.paid": {
        // Only notify on renewals (not the first invoice which follows checkout.session.completed)
        const billingReason = obj.billing_reason as string;
        if (billingReason === "subscription_cycle" || billingReason === "subscription_update") {
          await sendSaleNotification({
            eventType: event.type,
            customerEmail: obj.customer_email as string ?? null,
            amountTotal: obj.amount_paid as number ?? null,
            currency: obj.currency as string ?? null,
            subscriptionId: obj.subscription as string ?? null,
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        await sendSaleNotification({
          eventType: event.type,
          customerEmail: null,
          subscriptionId: obj.id as string ?? null,
        });
        break;
      }

      default:
        // Unhandled event types — stripe-replit-sync already synced them to the DB.
        break;
    }
  }
}
