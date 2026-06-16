import Stripe from 'stripe';

/**
 * Resolves Stripe secret key and webhook secret from environment variables.
 *
 * Priority:
 * 1. `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` — standard env vars (works anywhere: Vercel, Railway, etc.)
 * 2. Replit connector API (fallback for Replit deployments)
 */
async function getCredentials(): Promise<{ secretKey: string; webhookSecret?: string }> {
  // -----------------------------------------------------------------------
  // Priority 1: Standard env vars (Vercel, Railway, Fly.io, etc.)
  // -----------------------------------------------------------------------
  const envKey = process.env.STRIPE_SECRET_KEY;
  if (envKey) {
    return {
      secretKey: envKey,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    };
  }

  // -----------------------------------------------------------------------
  // Priority 2: Replit connector (legacy)
  // -----------------------------------------------------------------------
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? 'depl ' + process.env.WEB_REPL_RENEWAL
      : null;

  if (!hostname || !xReplitToken) {
    throw new Error(
      'Stripe is not configured. Set STRIPE_SECRET_KEY in your environment, ' +
      'or connect Stripe via the Replit Integrations tab.'
    );
  }

  const isProduction = process.env.REPLIT_DEPLOYMENT === '1';
  const targetEnvironment = isProduction ? 'production' : 'development';

  const url = new URL(`https://${hostname}/api/v2/connection`);
  url.searchParams.set('include_secrets', 'true');
  url.searchParams.set('connector_names', 'stripe');
  url.searchParams.set('environment', targetEnvironment);

  const resp = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
      'X-Replit-Token': xReplitToken,
    },
    signal: AbortSignal.timeout(10_000),
  });

  if (!resp.ok) {
    throw new Error(`Failed to fetch Stripe credentials: ${resp.status} ${resp.statusText}`);
  }

  const data = await resp.json() as {
    items?: Array<{ settings?: { secret?: string; publishable?: string; webhook_secret?: string } }>
  };
  const settings = data.items?.[0]?.settings;

  if (!settings?.secret) {
    throw new Error(
      'Stripe integration not connected or missing secret key. ' +
      'Connect Stripe via the Integrations tab first.'
    );
  }

  return {
    secretKey: settings.secret,
    webhookSecret: settings.webhook_secret,
  };
}

export async function getUncachableStripeClient(): Promise<Stripe> {
  const { secretKey } = await getCredentials();
  return new Stripe(secretKey);
}

/**
 * Used only for Replit deployments where stripe-replit-sync manages
 * webhook registration and DB syncing. On Vercel, webhooks are configured
 * manually in the Stripe dashboard.
 */
export async function getStripeSync(): Promise<import('stripe-replit-sync').StripeSync> {
  const { StripeSync } = await import('stripe-replit-sync');

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  const { secretKey, webhookSecret } = await getCredentials();
  return new StripeSync({
    poolConfig: { connectionString: databaseUrl },
    stripeSecretKey: secretKey,
    stripeWebhookSecret: webhookSecret ?? '',
  });
}
