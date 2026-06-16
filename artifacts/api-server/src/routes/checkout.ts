import { Router, type IRouter } from "express";
import { getUncachableStripeClient } from "../stripeClient.js";
import { CreateCheckoutBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/checkout", async (req, res) => {
  try {
    const parsed = CreateCheckoutBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const { priceId, email } = parsed.data;

    const stripe = await getUncachableStripeClient();

    const replitDomain = process.env.REPLIT_DOMAINS?.split(",")[0];
    const host = req.get("host");
    // Vercel terminates TLS at the edge, so req.protocol is "http" internally.
    // Use x-forwarded-proto when available, fall back to https.
    const protocol = req.get("x-forwarded-proto") || "https";
    const baseUrl = replitDomain
      ? `https://${replitDomain}`
      : host
        ? `${protocol}://${host}`
        : `https://cookielite.online`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      ...(email ? { customer_email: email } : {}),
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/`,
    });

    res.json({ url: session.url });
  } catch (err) {
    req.log.error({ err }, "Failed to create checkout session");
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

export default router;
