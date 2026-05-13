import { sql } from 'drizzle-orm';
import { db } from '@workspace/db';

export class Storage {
  async listProductsWithPrices() {
    const result = await db.execute(
      sql`
        SELECT
          p.id AS product_id,
          p.name AS product_name,
          p.description AS product_description,
          pr.id AS price_id,
          pr.unit_amount,
          pr.currency,
          pr.recurring
        FROM stripe.products p
        JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
        WHERE p.active = true
        ORDER BY pr.unit_amount ASC
      `
    );
    return result.rows;
  }

  async getSubscription(subscriptionId: string) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.subscriptions WHERE id = ${subscriptionId}`
    );
    return result.rows[0] || null;
  }
}

export const storage = new Storage();
