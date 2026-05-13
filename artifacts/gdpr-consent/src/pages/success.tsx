import { SEO } from "@/components/seo";
import { Layout } from "@/components/layout";
import { CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Success() {
  return (
    <Layout>
      <SEO 
        title="Welcome to CookieLite | Account Created"
        description="Thanks for signing up to CookieLite."
      />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[60vh] bg-dot-pattern relative">
        <div className="absolute inset-0 bg-background/80 z-0" />
        
        <div className="relative z-10 max-w-md w-full dotted-frame bg-card p-10 text-center shadow-xl animate-in zoom-in-95 duration-500">
          <div className="mx-auto w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-6">
            <CheckCircle className="w-8 h-8" />
          </div>
          
          <h1 className="text-3xl font-bold text-primary mb-4">You're in.</h1>
          
          <p className="text-muted-foreground mb-8">
            Your payment was successful. We're setting up your workspace now. Check your email for login instructions and your installation script.
          </p>
          
          <div className="p-4 bg-muted text-sm font-mono text-left mb-8 border-l-4 border-accent">
            <p className="text-muted-foreground mb-1">Next steps:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2 text-foreground">
              <li>Check your inbox</li>
              <li>Click the setup link</li>
              <li>Copy the script tag</li>
            </ol>
          </div>

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