import { useState } from "react";
import { useCheckDomain } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, Loader2, ShieldAlert } from "lucide-react";
import { CheckoutForm } from "./checkout-form";

export function DomainChecker() {
  const [url, setUrl] = useState("");
  const checkDomain = useCheckDomain();

  function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    checkDomain.mutate({ data: { url: url.trim() } });
  }

  const result = checkDomain.data;
  const isPending = checkDomain.isPending;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <form onSubmit={handleCheck} className="flex gap-2">
        <Input
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            checkDomain.reset();
          }}
          placeholder="yourdomain.com"
          className="h-12 border-primary focus-visible:ring-accent rounded-none bg-background shadow-sm font-mono flex-1"
          disabled={isPending}
        />
        <Button
          type="submit"
          className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-none shadow-sm whitespace-nowrap"
          disabled={isPending || !url.trim()}
        >
          {isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scanning…</>
          ) : (
            "Check Now"
          )}
        </Button>
      </form>

      {result && (
        <div
          className={`dotted-frame p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
            result.compliant
              ? "border-green-500/40 bg-green-50/50 dark:bg-green-950/20"
              : "border-destructive/40 bg-red-50/50 dark:bg-red-950/20"
          }`}
        >
          {result.compliant ? (
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-green-700 dark:text-green-400 text-lg mb-1">
                  You're covered.
                </p>
                <p className="text-sm text-muted-foreground font-mono">{result.message}</p>
                {result.tool && (
                  <span className="inline-block mt-3 text-xs font-mono bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-1 border border-green-300/50">
                    Tool detected: {result.tool}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <XCircle className="w-8 h-8 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-destructive text-lg mb-1">
                    No cookie banner detected.
                  </p>
                  <p className="text-sm text-muted-foreground font-mono">{result.message}</p>
                </div>
              </div>

              <div className="border-t border-dashed border-primary/20 pt-5">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldAlert className="w-5 h-5 text-accent" />
                  <p className="font-semibold text-primary text-sm">
                    Fix it now for €7/month — cancel anytime.
                  </p>
                </div>
                <CheckoutForm buttonText="Get Compliant" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
