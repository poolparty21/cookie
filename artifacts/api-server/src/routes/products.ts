import { Router, type IRouter } from "express";
import { storage } from "../storage";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.get("/products", async (req, res) => {
  try {
    const rows = await storage.listProductsWithPrices();

    const products = rows.map((row: any) => ({
      id: String(row.product_id),
      name: String(row.product_name),
      description: row.product_description ? String(row.product_description) : null,
      priceId: String(row.price_id),
      unitAmount: Number(row.unit_amount),
      currency: String(row.currency),
      interval: row.recurring ? (row.recurring as any).interval ?? "month" : "month",
    }));

    res.json(products);
  } catch (err) {
    req.log.error({ err }, "Failed to list products");
    res.status(500).json({ error: "Failed to load products" });
  }
});

export default router;
