import { SEO } from "@/components/seo";
import { Layout } from "@/components/layout";
import { CheckCircle2, ShieldCheck, Zap, Server } from "lucide-react";
import { CheckoutForm } from "@/components/checkout-form";
import { DomainChecker } from "@/components/domain-checker";

export default function Home() {
  return (
    <Layout>
      <SEO
        title="CookieLite — Cheapest GDPR Cookie Consent Banner"
        description="Get a fully compliant GDPR cookie banner for just €7/month. The most affordable GDPR cookie consent tool for small businesses. Easy setup."
        canonicalUrl="/"
      />

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden flex flex-col items-center text-center bg-dot-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 z-0" />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center rounded-full border border-primary/20 px-3 py-1 text-sm font-medium text-primary mb-8 bg-card shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-accent mr-2"></span>
            The €7/month alternative to Cookiebot
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-primary mb-6 leading-tight">
            Is your site<br className="hidden sm:block" />
            <span className="text-accent underline decoration-dashed underline-offset-8">GDPR compliant?</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl font-mono">
            Enter your domain and we'll check for a cookie consent banner in seconds.
          </p>

          <div className="w-full max-w-2xl">
            <DomainChecker />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-dashed border-primary/20 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-8 text-muted-foreground font-mono text-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" /> GDPR Compliant
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-primary/30" />
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-primary" /> EU Servers
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-primary/30" />
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" /> Under 5kb
          </div>
        </div>
      </section>

      {/* Features & Comparison */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-4 text-primary">Everything you need. <br />Nothing you don't.</h2>
                <p className="text-muted-foreground font-mono">We built exactly what the law requires, without the bloated dashboard or sneaky price hikes.</p>
              </div>

              <ul className="space-y-4">
                {[
                  "Customizable cookie banner",
                  "Automatic cookie scanning",
                  "Consent audit log",
                  "One line of code to install",
                  "Multi-language support",
                  "Cancel anytime with one click"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-accent mr-3 flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="dotted-frame p-8 bg-card shadow-lg relative rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-4 py-1 text-sm font-bold shadow-md transform rotate-3">
                Save 50%+
              </div>
              <h3 className="text-xl font-bold mb-6 text-center border-b border-dashed border-primary/20 pb-4">The Market Standard</h3>

              <div className="space-y-6">
                <div className="flex justify-between items-center opacity-50">
                  <span className="font-medium">Cookiebot</span>
                  <span className="font-mono line-through">€14.00/mo</span>
                </div>
                <div className="flex justify-between items-center opacity-50">
                  <span className="font-medium">CookieYes</span>
                  <span className="font-mono line-through">€10.00/mo</span>
                </div>
                <div className="flex justify-between items-center opacity-50">
                  <span className="font-medium">Usercentrics</span>
                  <span className="font-mono line-through">€9.00/mo</span>
                </div>

                <div className="pt-6 mt-6 border-t border-dashed border-primary/20 flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">CookieLite</span>
                  <span className="text-3xl font-bold text-accent font-mono">€7.00<span className="text-sm text-muted-foreground">/mo</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-muted/20 border-t border-dashed border-primary/20 bg-dot-pattern-dense relative">
        <div className="absolute inset-0 bg-background/80 z-0" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12 text-primary">Honest Answers</h2>

          <div className="space-y-6">
            {[
              { q: "What is a GDPR cookie banner?", a: "It's a notice that asks visitors for permission before tracking them with cookies. EU law requires this if your site uses analytics, marketing tools, or embedded content." },
              { q: "Is €7/month really all I pay?", a: "Yes. One flat price for one domain. No arbitrary limits on pageviews. No surprise bills when your traffic spikes." },
              { q: "Do I actually need this?", a: "If your business serves EU customers and uses Google Analytics, Meta Pixel, or similar tracking tools, yes. It's the law." },
              { q: "How do I install it?", a: "You copy one snippet of script and paste it into your website's <head>. That's it. It works with WordPress, Webflow, React, HTML, anything." },
              { q: "Are you really compliant?", a: "Yes. We scan your site, block scripts prior to consent, log the consents securely, and provide visitors a way to withdraw consent. That's the full GDPR requirement checklist." }
            ].map((faq, i) => (
              <div key={i} className="bg-card p-6 border border-primary/10 shadow-sm hover:border-primary/30 transition-colors">
                <h3 className="font-bold text-lg mb-2 text-primary">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto dotted-frame p-12 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />

          <h2 className="text-3xl font-bold mb-6 relative z-10">Stop overpaying for compliance.</h2>
          <p className="text-primary-foreground/80 mb-8 font-mono relative z-10">Get set up in 5 minutes. Cancel anytime.</p>

          <div className="bg-card text-foreground p-6 mx-auto relative z-10 max-w-sm">
            <CheckoutForm buttonText="Start for €7" />
          </div>
        </div>
      </section>
    </Layout>
  );
}
