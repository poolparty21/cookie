import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "cookielite_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 flex justify-center">
      <div className="dotted-frame bg-card border border-primary/20 shadow-2xl max-w-2xl w-full p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-mono text-foreground leading-relaxed">
            <span className="font-bold text-primary">This site uses cookies</span>{" "}
            only for essential payment processing via Stripe. No tracking,
            no analytics, no third-party ads.{" "}
            <a href="/privacy" className="text-accent underline underline-offset-2 hover:text-accent/80">
              Privacy Policy
            </a>
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            onClick={decline}
            variant="outline"
            size="sm"
            className="rounded-none font-mono text-xs h-9"
          >
            Decline
          </Button>
          <Button
            onClick={accept}
            size="sm"
            className="rounded-none font-mono text-xs h-9 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
