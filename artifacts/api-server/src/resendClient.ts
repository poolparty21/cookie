// Email client using Gmail SMTP via nodemailer
import nodemailer from "nodemailer";

const GMAIL_ADDRESS = "ilwaqfa@gmail.com";

// WARNING: Never cache this transporter if credentials may rotate.
export async function getUncachableResendClient(): Promise<{
  client: { emails: { send: (opts: { from: string; to: string[]; subject: string; html: string }) => Promise<{ data?: { id?: string }; error?: unknown }> } };
  fromEmail: string;
}> {
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  if (!appPassword) throw new Error("GMAIL_APP_PASSWORD secret is not set");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_ADDRESS,
      pass: appPassword,
    },
  });

  // Wrap nodemailer in the same interface as the Resend client
  const client = {
    emails: {
      send: async (opts: { from: string; to: string[]; subject: string; html: string }) => {
        try {
          await transporter.sendMail({
            from: opts.from,
            to: opts.to.join(", "),
            subject: opts.subject,
            html: opts.html,
          });
          return { data: { id: "gmail-sent" } };
        } catch (err) {
          return { error: err };
        }
      },
    },
  };

  return { client, fromEmail: GMAIL_ADDRESS };
}
