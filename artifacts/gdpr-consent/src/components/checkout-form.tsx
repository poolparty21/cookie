import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateCheckout, useListProducts } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export function CheckoutForm({ buttonText = "Get Started" }: { buttonText?: string }) {
  const { data: products, isLoading: isLoadingProducts } = useListProducts();
  const createCheckout = useCreateCheckout();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Find the EUR 7 product or default to the first one available
    const product = products?.find(p => p.unitAmount === 700) || products?.[0];
    
    if (!product) {
      toast({
        title: "Error loading products",
        description: "Please try again later or contact support.",
        variant: "destructive",
      });
      return;
    }

    createCheckout.mutate(
      { data: { priceId: product.priceId, email: values.email } },
      {
        onSuccess: (data) => {
          window.location.href = data.url;
        },
        onError: () => {
          toast({
            title: "Checkout Error",
            description: "Could not create checkout session. Please try again.",
            variant: "destructive",
          });
        }
      }
    );
  }

  const isPending = createCheckout.isPending;

  return (
    <div className="w-full max-w-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    placeholder="name@company.com" 
                    {...field} 
                    className="h-12 border-primary focus-visible:ring-accent rounded-none bg-background shadow-sm"
                    disabled={isPending || isLoadingProducts}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-none shadow-sm transition-transform hover:translate-y-[-2px] hover:shadow-md"
            disabled={isPending || isLoadingProducts}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {buttonText} — €7/month
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2 font-mono">
            Secure payment via Stripe. Cancel anytime.
          </p>
        </form>
      </Form>
    </div>
  );
}