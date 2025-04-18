
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [handledSignInEvent, setHandledSignInEvent] = useState(false);
  const [handledSignOutEvent, setHandledSignOutEvent] = useState(false);
  
  useEffect(() => {
    let isSubscribed = true;
    
    // First set up auth state listener to catch events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed in provider:", event);
        
        if (isSubscribed) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setLoading(false);
          
          // Only show toasts for specific events and prevent duplicates
          if (event === 'SIGNED_OUT' && !handledSignOutEvent) {
            toast.info("You have been signed out");
            setHandledSignOutEvent(true);
            // Reset sign-in flag when signing out
            setHandledSignInEvent(false);
          } else if (event === 'SIGNED_IN' && !handledSignInEvent) {
            toast.success("Successfully signed in");
            setHandledSignInEvent(true);
            // Reset sign-out flag when signing in
            setHandledSignOutEvent(false);
          } else if (event === 'USER_UPDATED') {
            toast.success("User profile updated");
          }
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      console.log("Getting session in provider:", initialSession?.user?.email || "No session");
      
      if (error) {
        console.error("Error getting session:", error);
        if (isSubscribed) {
          toast.error("Authentication error", {
            description: "There was a problem verifying your login status"
          });
        }
      }
      
      if (isSubscribed) {
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, [handledSignInEvent, handledSignOutEvent]);

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      // Toast for sign out is handled by the onAuthStateChange listener
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out", {
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
