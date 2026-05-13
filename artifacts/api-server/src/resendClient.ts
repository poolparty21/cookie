import { Resend } from "resend";

// Uses RESEND_API_KEY secret directly (set via Replit Secrets)
// fromEmail falls back to onboarding@resend.dev for testing; set a verified domain in production
export async function getUncachableResendClient(): Promise<{ client: Resend; fromEmail: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY secret is not set");
  return {
    client: new Resend(apiKey),
    fromEmail: "onboarding@resend.dev",
  };
}
