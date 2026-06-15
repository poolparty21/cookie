import { SEO } from "@/components/seo";
import { Layout } from "@/components/layout";
import { CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const EMBED_CODE = `<script src="https://cdn.cookielite.io/banner.js" data-site-id="YOUR_SITE_ID" async></script>`;

export default function Success() {
  function copyCode() {
    navigator.clipboard.writeText(EMBED_CODE);
  }

  return (
    <Layout>
      <SEO
        title="Welcome to CookieLite | You're All Set"
        description="Your CookieLite subscription is active. Copy your embed code and paste it into your website."
      />

      <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[60vh] bg-dot-pattern relative">
        <div className="absolute inset-0 bg-background/80 z-0" />

        <div className="relative z-10 max-w-lg w-full dotted-frame bg-card p-10 text-center shadow-xl animate-in zoom-in-95 duration-500">
          <div className="mx-auto w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-6">
            <CheckCircle className="w-8 h-8" />
          </div>

          <h1 className="text-3xl font-bold text-primary mb-2">You're in.</h1>
          <p className="text-muted-foreground mb-8 font-mono text-sm">
            Paste this snippet into your website's{" "}
            <code className="text-accent">&lt;head&gt;</code> and you're GDPR
            compliant.
          </p>

          <div className="bg-muted border border-dashed border-primary/30 p-4 text-left mb-3 relative group">
            <pre className="text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
              {EMBED_CODE}
            </pre>
          </div>

          <Button
            onClick={copyCode}
            className="w-full h-11 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-none mb-8"
          >
            Copy Code
          </Button>

          <p className="text-xs text-muted-foreground font-mono mb-6">
            Replace <span className="text-accent">YOUR_SITE_ID</span> with the
            ID shown in your Stripe receipt. That's it — no account, no
            dashboard, no setup wizard.
          </p>

          <Link href="/">
            <Button variant="outline" className="w-full rounded-none font-mono">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
