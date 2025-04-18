
import { createContext, useContext, useEffect, useState, useRef } from "react";
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
  const handledEvents = useRef<Record<string, boolean>>({});
  
  // Used to prevent duplicate toasts when page visibility changes
  const visibilityHandled = useRef(false);

  useEffect(() => {
    let isSubscribed = true;
    
    // Handle page visibility changes to prevent duplicate toasts
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        visibilityHandled.current = true;
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // First set up auth state listener to catch events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed in provider:", event);
        
        if (isSubscribed) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setLoading(false);
          
          // Create a unique key for this event to prevent duplicates
          const eventKey = `${event}_${Date.now()}`;
          
          // Only show toasts for events that haven't been handled yet
          // and only when the page is visible
          if (!handledEvents.current[event] && document.visibilityState === 'visible' && !visibilityHandled.current) {
            // Provide feedback on authentication events
            if (event === 'SIGNED_OUT') {
              toast.info("You have been signed out");
              handledEvents.current[event] = true;
            } else if (event === 'TOKEN_REFRESHED') {
              console.log("Session token refreshed successfully");
            } else if (event === 'USER_UPDATED') {
              toast.success("User profile updated");
            } else if (event === 'SIGNED_IN') {
              toast.success("Successfully signed in");
              handledEvents.current[event] = true;
            }
          }
          
          // Reset handled events after a short delay to allow for future events
          if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
            setTimeout(() => {
              handledEvents.current = {};
              visibilityHandled.current = false;
            }, 1000);
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
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      // The toast for sign out will be shown by the onAuthStateChange listener
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
