import { ReactNode } from "react";
import { Link } from "wouter";
import { CookieBanner } from "./cookie-banner";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-6xl flex-1 flex flex-col dotted-frame bg-card relative shadow-2xl">
        <header className="w-full border-b border-dashed border-primary/20 p-6 flex items-center justify-between z-10 bg-card">
          <Link href="/" className="font-mono font-bold text-xl tracking-tight text-primary flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-accent animate-pulse" />
            CookieLite.
          </Link>
          <nav>
            <Link href="/" className="text-sm font-medium hover:text-accent transition-colors">
              Get Started
            </Link>
          </nav>
        </header>

        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>

        <footer className="w-full border-t border-dashed border-primary/20 p-8 mt-auto z-10 bg-card">
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground font-mono">
                &copy; {new Date().getFullYear()} CookieLite EU. No tracking, ironically.
              </p>
              <div className="flex items-center gap-6">
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-mono border-t border-dashed border-primary/10 pt-4">
              <span className="font-semibold text-primary/60">Legal disclaimer:</span>{" "}
              CookieLite provides a cookie consent banner tool to assist with GDPR compliance.
              Use of this tool does not constitute legal advice and does not guarantee full
              regulatory compliance. You remain responsible for ensuring your website meets
              all applicable data protection laws. CookieLite EU is not liable for any
              fines, penalties, or legal consequences arising from the use or misuse of this service.
            </p>
          </div>
        </footer>
      </div>

      <CookieBanner />
    </div>
  );
}
