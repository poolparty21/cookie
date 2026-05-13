import { Router, type IRouter } from "express";
import { CheckDomainBody } from "@workspace/api-zod";

const router: IRouter = Router();

const CONSENT_SIGNATURES: Array<{ name: string; patterns: string[] }> = [
  { name: "Cookiebot", patterns: ["cookiebot.com", "CookieConsent", "Cookiebot"] },
  { name: "CookieYes", patterns: ["cookieyes.com", "cky-consent", "cookieyes"] },
  { name: "OneTrust", patterns: ["onetrust.com", "OptanonConsent", "onetrust", "optanon"] },
  { name: "Usercentrics", patterns: ["usercentrics.eu", "usercentrics.com", "usercentrics"] },
  { name: "Termly", patterns: ["termly.io", "termly-code-snippet"] },
  { name: "Didomi", patterns: ["didomi.io", "didomi-notice", "didomi"] },
  { name: "Quantcast", patterns: ["quantcast.com/cmp", "quantcast-choice", "cmp.quantcast"] },
  { name: "Iubenda", patterns: ["iubenda.com", "iubenda-cs-banner", "iubenda"] },
  { name: "Osano", patterns: ["osano.com", "osano-cm"] },
  { name: "TrustArc", patterns: ["trustarc.com", "truste.com", "consent.trustarc"] },
  { name: "Civic Cookie Control", patterns: ["cookiecontrol", "civicuk.com", "CookieControl"] },
  { name: "Klaro", patterns: ["klaro.kiprotect.com", "klaro.js", "\"klaro\""] },
  { name: "CookieLite", patterns: ["cookielite.io", "cookielite"] },
  { name: "Cookie Consent (generic)", patterns: [
    "cookie-consent", "cookie_consent", "gdpr-consent", "gdpr_consent",
    "cookieconsent", "cookie-notice", "cookie-banner", "cookie-bar",
    "consent-banner", "consent-manager", "cmp-", "gdpr-banner",
    "cookielaw", "cookie-law", "accepts-cookies", "cookie-accepted",
  ]},
];

function normaliseUrl(raw: string): string {
  const trimmed = raw.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

router.post("/check-domain", async (req, res) => {
  const parsed = CheckDomainBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please provide a valid URL." });
    return;
  }

  const rawUrl = parsed.data.url;
  let targetUrl: string;

  try {
    targetUrl = normaliseUrl(rawUrl);
    new URL(targetUrl);
  } catch {
    res.status(400).json({ error: "Invalid URL." });
    return;
  }

  try {
    const response = await fetch(targetUrl, {
      signal: AbortSignal.timeout(8_000),
      headers: {
        "User-Agent": "CookieLiteChecker/1.0 (GDPR compliance scanner; +https://cookielite.eu)",
        "Accept": "text/html",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      res.status(200).json({
        url: targetUrl,
        compliant: false,
        tool: null,
        message: `Could not reach ${targetUrl} (HTTP ${response.status}). If this is your domain, you likely need a cookie banner.`,
      });
      return;
    }

    const html = await response.text();
    const lower = html.toLowerCase();

    let detectedTool: string | null = null;
    for (const sig of CONSENT_SIGNATURES) {
      if (sig.patterns.some((p) => lower.includes(p.toLowerCase()))) {
        detectedTool = sig.name;
        break;
      }
    }

    if (detectedTool) {
      res.json({
        url: targetUrl,
        compliant: true,
        tool: detectedTool,
        message: `${detectedTool} detected — your site has a cookie consent banner.`,
      });
    } else {
      res.json({
        url: targetUrl,
        compliant: false,
        tool: null,
        message: "No cookie consent banner detected. Your site may be non-compliant with GDPR.",
      });
    }
  } catch (err: any) {
    const isTimeout = err?.name === "TimeoutError" || err?.name === "AbortError";
    req.log.warn({ err, targetUrl }, "Domain check fetch error");
    res.status(200).json({
      url: targetUrl,
      compliant: false,
      tool: null,
      message: isTimeout
        ? `Request timed out for ${targetUrl}. The site may be slow or blocking automated requests.`
        : `Could not reach ${targetUrl}. Check the URL and try again.`,
    });
  }
});

export default router;
