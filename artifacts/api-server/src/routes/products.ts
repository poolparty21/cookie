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

    const products = productsResp.data.map((product) => {
      const productPrices = pricesResp.data.filter(
        (p) => (typeof p.product === "string" ? p.product : p.product?.id) === product.id
      );
      const price =
        productPrices.find((p) => p.recurring?.interval === "month") ??
        productPrices[0];

      return {
        id: product.id,
        name: product.name,
        description: product.description ?? null,
        priceId: price?.id ?? null,
        unitAmount: price?.unit_amount ?? null,
        currency: price?.currency ?? "eur",
        interval: price?.recurring?.interval ?? "month",
      };
    });

    res.json(products);
  } catch (err) {
    req.log.error({ err }, "Failed to list products");
    res.status(500).json({ error: "Failed to load products" });
  }
});

export default router;
