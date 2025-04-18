
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthForm from "@/components/auth/AuthForm";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";

const Auth = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;

    // First set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("Auth state changed in Auth page:", event);
      
      if (!isSubscribed) return;
      
      setSession(currentSession);
      
      if (currentSession) {
        console.log("Session detected, redirecting to home");
        // Allow a small delay for the session to be fully established
        setTimeout(() => {
          navigate("/home");
        }, 300);
      }
    });

    // Then check for existing session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          if (isSubscribed) toast.error("Failed to verify authentication status");
        }
        
        if (isSubscribed) {
          console.log("Getting session in Auth page:", data.session?.user?.email || "No session");
          setSession(data.session);
          
          if (data.session) {
            console.log("Existing session found, redirecting to home");
            navigate("/home");
          }
          
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Unexpected error checking session:", err);
        if (isSubscribed) {
          setIsLoading(false);
          toast.error("Authentication service error");
        }
      }
    };

    checkSession();

    return () => {
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
        <Loader size="lg" />
      </div>
    );
  }

  if (session) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-background via-background to-secondary/20">
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

        <p className="text-center text-sm text-muted-foreground mt-4">
          By continuing, you agree to VOILIA's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Auth;
