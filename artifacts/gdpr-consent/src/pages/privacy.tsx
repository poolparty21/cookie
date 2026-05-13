import { SEO } from "@/components/seo";
import { Layout } from "@/components/layout";

export default function Privacy() {
  return (
    <Layout>
      <SEO
        title="Privacy Policy | CookieLite"
        description="How we handle your data. Spoiler: with respect."
        canonicalUrl="/privacy"
      />

      <article className="max-w-3xl mx-auto py-16 px-6 prose prose-slate max-w-none">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground font-mono">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>

        <div className="dotted-frame p-8 bg-card shadow-sm space-y-6">
          <section>
            <h2 className="text-xl font-bold text-primary mb-3">1. Plain English Summary</h2>
            <p className="text-muted-foreground">
              We sell a GDPR cookie consent tool. We do not sell your data, track your
              behaviour, or use analytics on this site. We collect only what is strictly
              necessary to process your payment. Billing is handled entirely by Stripe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">2. Data We Collect</h2>
            <p className="text-muted-foreground">
              When you purchase a subscription, Stripe collects your email address and payment
              details directly on their hosted checkout page. We receive only a customer ID and
              subscription status from Stripe — your card details and email never touch our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">3. Cookies on This Site</h2>
            <p className="text-muted-foreground">
              This site uses only one first-party cookie: a consent preference stored in your
              browser's local storage so we don't show the banner again. No third-party tracking
              cookies, no analytics, no advertising pixels.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">4. Third Parties</h2>
            <p className="text-muted-foreground">We share data only with:</p>
            <ul className="list-disc pl-5 mt-2 text-muted-foreground space-y-1">
              <li>
                <strong>Stripe</strong> — for subscription billing. Stripe is PCI DSS
                compliant and processes payments under their own privacy policy.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">5. Your Rights (GDPR)</h2>
            <p className="text-muted-foreground">
              Under GDPR you have the right to access, rectify, or erase personal data we hold
              about you. Because we hold only a Stripe customer ID, most requests can be fulfilled
              directly through Stripe's customer portal. To exercise any right, open a support
              request via your Stripe billing portal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">6. Legal Disclaimer</h2>
            <p className="text-muted-foreground">
              CookieLite provides a technical tool to help website owners display cookie consent
              notices. This service does not constitute legal advice. Compliance with GDPR and
              the ePrivacy Directive depends on how you configure and use the tool, the cookies
              your site sets, and your specific business context. We strongly recommend consulting
              a qualified legal professional to confirm your implementation meets applicable law.
              CookieLite EU accepts no liability for regulatory penalties or legal claims arising
              from use of this service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">7. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this policy. The date at the top of this page reflects the last
              revision. Continued use of the service after changes constitutes acceptance of the
              updated policy.
            </p>
          </section>
        </div>
      </article>
    </Layout>
  );
}
