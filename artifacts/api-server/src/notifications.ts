import { logger } from "./lib/logger";
import { getUncachableResendClient } from "./resendClient";

interface SaleNotification {
  eventType: string;
  customerEmail?: string | null;
  amountTotal?: number | null;
  currency?: string | null;
  subscriptionId?: string | null;
  sessionId?: string | null;
}

function formatAmount(amount: number | null | undefined, currency: string | null | undefined): string {
  if (!amount || !currency) return "unknown amount";
  return `${currency.toUpperCase()} ${(amount / 100).toFixed(2)}`;
}

export async function sendSaleNotification(notification: SaleNotification): Promise<void> {
  const notifyEmail = process.env.NOTIFICATION_EMAIL;

  if (!notifyEmail) {
    logger.info({ eventType: notification.eventType }, "Sale event — set NOTIFICATION_EMAIL to enable alerts");
    return;
  }

  let resendClient: Awaited<ReturnType<typeof getUncachableResendClient>>;
  try {
    resendClient = await getUncachableResendClient();
  } catch (err) {
    logger.warn({ err }, "Resend not connected — skipping email notification");
    return;
  }

  const { client, fromEmail } = resendClient;
  const amount = formatAmount(notification.amountTotal, notification.currency);
  const isCancel = notification.eventType === "customer.subscription.deleted";
  const isRenewal = notification.eventType === "invoice.paid";

  const subject = isCancel
    ? "❌ CookieLite — Subscription Cancelled"
    : isRenewal
      ? `✅ CookieLite — Renewal Received (${amount})`
      : `🎉 CookieLite — New Sale! ${amount}`;

  const lines: string[] = [];

  if (!isCancel) {
    lines.push(`<p><strong>Amount:</strong> ${amount}</p>`);
  }
  if (notification.customerEmail) {
    lines.push(`<p><strong>Customer:</strong> ${notification.customerEmail}</p>`);
  }
  if (notification.subscriptionId) {
    lines.push(`<p><strong>Subscription ID:</strong> <code>${notification.subscriptionId}</code></p>`);
  }
  if (notification.sessionId) {
    lines.push(`<p><strong>Session ID:</strong> <code>${notification.sessionId}</code></p>`);
  }

  const html = `
    <div style="font-family:monospace;max-width:520px;margin:0 auto;border:2px dashed #6366f1;padding:28px;">
      <h2 style="margin-top:0;color:#1e1b4b;">${subject}</h2>
      <div style="border-top:1px dashed #c7d2fe;padding-top:16px;margin-top:16px;">
        ${lines.join("\n") || "<p>See Stripe dashboard for full details.</p>"}
      </div>
      <p style="font-size:12px;color:#6b7280;margin-top:24px;border-top:1px dashed #e5e7eb;padding-top:12px;">
        CookieLite · Stripe Notification
      </p>
    </div>`;

  try {
    const { error } = await client.emails.send({
      from: `CookieLite <${fromEmail}>`,
      to: [notifyEmail],
      subject,
      html,
    });

    if (error) {
      logger.warn({ error }, "Resend email failed");
    } else {
      logger.info({ eventType: notification.eventType, to: notifyEmail }, "Sale notification sent");
    }
  } catch (err) {
    logger.warn({ err }, "Failed to send sale notification email");
  }
}
