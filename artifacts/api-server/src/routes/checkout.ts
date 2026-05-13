import { Router, type IRouter } from "express";
import { getUncachableStripeClient } from "../stripeClient";
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

    const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(",")[0]}`;

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
