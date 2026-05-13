import { Resend } from "resend";

async function getResendApiKey(): Promise<string | null> {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? "depl " + process.env.WEB_REPL_RENEWAL
      : null;

  if (!hostname || !xReplitToken) return null;

  const isProduction = process.env.REPLIT_DEPLOYMENT === "1";
  const targetEnvironment = isProduction ? "production" : "development";

  try {
    const url = new URL(`https://${hostname}/api/v2/connection`);
    url.searchParams.set("include_secrets", "true");
    url.searchParams.set("connector_names", "resend");
    url.searchParams.set("environment", targetEnvironment);

    const resp = await fetch(url.toString(), {
      headers: { Accept: "application/json", "X-Replit-Token": xReplitToken },
      signal: AbortSignal.timeout(5_000),
    });

    if (!resp.ok) return null;

    const data = await resp.json() as {
      items?: Array<{ settings?: { api_key?: string } }>;
    };

    return data.items?.[0]?.settings?.api_key ?? null;
  } catch {
    return null;
  }
}

export async function getResendClient(): Promise<Resend | null> {
  const apiKey = await getResendApiKey();
  if (!apiKey) return null;
  return new Resend(apiKey);
}
