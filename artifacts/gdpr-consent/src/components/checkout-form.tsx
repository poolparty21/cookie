import { useCreateCheckout, useListProducts } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CheckoutForm({ buttonText = "Get Started" }: { buttonText?: string }) {
  const { data: products, isLoading: isLoadingProducts } = useListProducts();
  const createCheckout = useCreateCheckout();
  const { toast } = useToast();

  function handleClick() {
    const product =
      products?.find((p) => p.interval === "month") ?? products?.[0];

    if (!product?.priceId) {
      toast({
        title: "Error loading products",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
      return;
    }

    createCheckout.mutate(
      { data: { priceId: product.priceId } },
      {
        onSuccess: (data) => {
          window.location.href = data.url;
        },
        onError: (error) => {
          const errMsg =
            error instanceof Error
              ? error.message
              : "Could not start checkout. Please try again.";
          toast({
            title: "Checkout Error",
            description: errMsg,
            variant: "destructive",
          });
        },
      }
    );
  }

  const isPending = createCheckout.isPending;

  return (
    <div className="w-full max-w-sm">
      <Button
        onClick={handleClick}
        className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-none shadow-sm transition-transform hover:translate-y-[-2px] hover:shadow-md"
        disabled={isPending || isLoadingProducts}
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {buttonText} — €7/month
      </Button>
      <p className="text-xs text-center text-muted-foreground mt-2 font-mono">
        Secure payment via Stripe. Cancel anytime.
      </p>
    </div>
  );
}
