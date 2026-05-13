import { getUncachableStripeClient } from './stripeClient';

async function createProducts() {
  try {
    const stripe = await getUncachableStripeClient();

    console.log('Checking for existing CookieLite products...');

    const existing = await stripe.products.search({
      query: "name:'CookieLite' AND active:'true'",
    });

    if (existing.data.length > 0) {
      console.log('CookieLite product already exists. Skipping creation.');
      const product = existing.data[0];
      console.log(`Product ID: ${product.id}`);

      const prices = await stripe.prices.list({ product: product.id, active: true });
      for (const p of prices.data) {
        console.log(`Price ID: ${p.id} — ${p.unit_amount} ${p.currency} / ${(p.recurring as any)?.interval}`);
      }
      return;
    }

    console.log('Creating CookieLite product...');

    const product = await stripe.products.create({
      name: 'CookieLite',
      description: 'GDPR Cookie Consent Manager — the simplest, most affordable cookie banner for EU businesses. Cancel anytime.',
    });
    console.log(`Created product: ${product.name} (${product.id})`);

    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 700, // €7.00
      currency: 'eur',
      recurring: { interval: 'month' },
    });
    console.log(`Created monthly price: €7.00/month (${monthlyPrice.id})`);

    const yearlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 6000, // €60.00/year (save ~29%)
      currency: 'eur',
      recurring: { interval: 'year' },
    });
    console.log(`Created yearly price: €60.00/year (${yearlyPrice.id})`);

    console.log('\nProducts created successfully!');
    console.log('Stripe webhooks will sync this data to your database automatically.');
  } catch (error: any) {
    console.error('Error creating products:', error.message);
    process.exit(1);
  }
}

createProducts();
