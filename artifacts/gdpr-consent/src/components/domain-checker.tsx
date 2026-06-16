import { useCheckDomain } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, Loader2, ShieldAlert, AlertTriangle, Gavel, WifiOff } from "lucide-react";
import { CheckoutForm } from "./checkout-form";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const FINES = [
  { country: "Ireland", case: "Meta (Facebook)", fine: "€1.2 billion", year: "2023" },
  { country: "France", case: "Google LLC", fine: "€150 million", year: "2022" },
  { country: "Italy", case: "Clearview AI", fine: "€20 million", year: "2022" },
];

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
  const error = checkDomain.error;
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Check Failed",
        description: error instanceof Error
          ? error.message
          : "Could not reach the scanner. The API server may be unavailable. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
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

      {error && (
        <div className="dotted-frame p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 border-destructive/40 bg-red-50/50">
          <div className="flex items-start gap-4">
            <WifiOff className="w-8 h-8 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-destructive text-lg mb-1">Scan unavailable.</p>
              <p className="text-sm text-muted-foreground font-mono">
                {error instanceof Error
                  ? error.message
                  : "The compliance scanner could not be reached. The domain will be checked automatically when the service is back online."}
              </p>
            </div>
          </div>
        </div>
      )}

      {result && (
        <>
          {result.compliant ? (
            <div className="dotted-frame p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 border-green-500/40 bg-green-50/50">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-green-700 text-lg mb-1">You're covered.</p>
                  <p className="text-sm text-muted-foreground font-mono">{result.message}</p>
                  {result.tool && (
                    <span className="inline-block mt-3 text-xs font-mono bg-green-100 text-green-700 px-2 py-1 border border-green-300/50">
                      Tool detected: {result.tool}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Primary failure result */}
              <div className="dotted-frame p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 border-destructive/40 bg-red-50/50">
                <div className="flex items-start gap-4 mb-5">
                  <XCircle className="w-8 h-8 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-destructive text-lg mb-1">
                      No cookie banner detected.
                    </p>
                    <p className="text-sm text-muted-foreground font-mono">{result.message}</p>
                  </div>
                </div>
                <div className="border-t border-dashed border-destructive/20 pt-5">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldAlert className="w-5 h-5 text-accent" />
                    <p className="font-semibold text-primary text-sm">
                      Fix it now for €7/month — cancel anytime.
                    </p>
                  </div>
                  <CheckoutForm buttonText="Get Compliant Now" />
                </div>
              </div>

              {/* Big urgency warning */}
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 border-2 border-destructive bg-destructive/5 p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-destructive" />
                <div className="flex items-start gap-3 mb-5">
                  <AlertTriangle className="w-7 h-7 text-destructive flex-shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <p className="font-black text-destructive text-xl uppercase tracking-wide leading-tight">
                      You are at risk of a GDPR fine.
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 font-mono">
                      Under EU law, operating a website without a valid cookie consent mechanism
                      can result in fines of up to <strong className="text-destructive">€20 million</strong> or{" "}
                      <strong className="text-destructive">4% of global annual turnover</strong> — whichever is higher.
                      Data protection authorities and GDPR enforcement lawyers are actively scanning
                      for non-compliant sites.
                    </p>
                  </div>
                </div>

                {/* Real fines table */}
                <div className="bg-card border border-destructive/20 mb-5">
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-destructive/20 bg-destructive/5">
                    <Gavel className="w-4 h-4 text-destructive" />
                    <span className="text-xs font-bold font-mono text-destructive uppercase tracking-widest">
                      Recent GDPR Enforcement Actions
                    </span>
                  </div>
                  <div className="divide-y divide-destructive/10">
                    {FINES.map((f) => (
                      <div key={f.case} className="flex items-center justify-between px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{f.case}</p>
                          <p className="text-xs text-muted-foreground font-mono">{f.country} · {f.year}</p>
                        </div>
                        <span className="text-base font-black text-destructive font-mono">{f.fine}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground font-mono mb-4 border-l-4 border-destructive/40 pl-3">
                  Small businesses are not exempt. DPAs across the EU are increasingly targeting
                  SMEs. A cookie consent banner is the single easiest compliance step you can take today.
                </p>

                <CheckoutForm buttonText="Fix This Now — €7/month" />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
