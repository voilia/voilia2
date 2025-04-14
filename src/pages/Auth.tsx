import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthForm from "@/components/auth/AuthForm";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
const Auth = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setSession(session);
      setIsLoading(false);
      if (session) {
        navigate("/home");
      }
    });

    // Listen for auth changes
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === "SIGNED_IN") {
        toast.success("Successfully signed in");
        navigate("/home");
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>;
  }
  if (session) {
    return null; // Will redirect in useEffect
  }
  return <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-background via-background to-secondary/20">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md animate-fade-in">
        <Card className="backdrop-blur-xl bg-card/80 border-border/40 shadow-xl rounded-2xl transition-all duration-300 hover:shadow-2xl">
          <CardContent className="pt-6">
            <div className="mb-6 text-center space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">Welcome to VOILIA</h1>
              <p className="text-sm text-muted-foreground">
                Your collaborative AI workspace
              </p>
            </div>
            
            <AuthForm />
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">By continuing,
you agree to VOILIA's Terms of Service and Privacy Policy.</p>
      </div>
    </div>;
};
export default Auth;