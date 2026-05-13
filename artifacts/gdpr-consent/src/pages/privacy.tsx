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
          <p className="text-muted-foreground font-mono">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>
        
        <div className="dotted-frame p-8 bg-card shadow-sm space-y-6">
          <section>
            <h2 className="text-xl font-bold text-primary mb-3">1. Plain English Summary</h2>
            <p className="text-muted-foreground">
              We sell a GDPR cookie consent tool. We do not sell your data. We collect only what is strictly necessary to process your payment and keep your account active. We use Stripe for payments.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">2. Data We Collect</h2>
            <p className="text-muted-foreground">
              When you sign up, we collect your email address. That's it. Payment details are handled entirely by Stripe and never touch our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">3. How We Use It</h2>
            <p className="text-muted-foreground">
              Your email is used to:
            </p>
            <ul className="list-disc pl-5 mt-2 text-muted-foreground space-y-1">
              <li>Create your account</li>
              <li>Send you invoices</li>
              <li>Send critical service updates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">4. Third Parties</h2>
            <p className="text-muted-foreground">
              We share data with:
            </p>
            <ul className="list-disc pl-5 mt-2 text-muted-foreground space-y-1">
              <li>Stripe (for billing)</li>
              <li>Our transactional email provider (for sending receipts)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">5. Your Rights</h2>
            <p className="text-muted-foreground">
              You have the right to request access to your data, request deletion, or correct any inaccuracies. Contact us at <a href="mailto:privacy@cookielite.eu" className="text-accent hover:underline">privacy@cookielite.eu</a> to exercise these rights.
            </p>
          </section>
        </div>
      </article>
    </Layout>
  );
}