import { Router, type IRouter } from "express";
import { getUncachableStripeClient } from "../stripeClient.js";

const router: IRouter = Router();

router.get("/products", async (req, res) => {
  try {
    const stripe = await getUncachableStripeClient();

    const [productsResp, pricesResp] = await Promise.all([
      stripe.products.list({ active: true, limit: 20 }),
      stripe.prices.list({ active: true, limit: 50, expand: ["data.product"] }),
    ]);

    const products = productsResp.data
      .map((product) => {
        const productPrices = pricesResp.data.filter(
          (p) => (typeof p.product === "string" ? p.product : p.product?.id) === product.id
        );
        // Only consider prices with a recurring interval (subscriptions)
        const subscriptionPrice = productPrices.find(
          (p) => p.recurring?.interval != null
        );
        if (!subscriptionPrice) return null;

        return {
          id: product.id,
          name: product.name,
          description: product.description ?? null,
          priceId: subscriptionPrice.id,
          unitAmount: subscriptionPrice.unit_amount ?? 0,
          currency: subscriptionPrice.currency ?? "eur",
          interval: subscriptionPrice.recurring!.interval,
        };
      })
      .filter((p): p is NonNullable<typeof p> => p != null);

    res.json(products);
  } catch (err) {
    req.log.error({ err }, "Failed to list products");
    res.status(500).json({ error: "Failed to load products" });
  }
});

export default router;
