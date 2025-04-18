
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

  useEffect(() => {
    // Configure session to expire after 8 hours
    const SESSION_DURATION_HOURS = 8 * 60 * 60; // 8 hours in seconds
    
    let isSubscribed = true;

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed in provider:", event);
        
        if (isSubscribed) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
          
          // Provide feedback on authentication events
          if (event === 'SIGNED_OUT') {
            toast.info("You have been signed out");
          } else if (event === 'TOKEN_REFRESHED') {
            console.log("Session token refreshed successfully");
          } else if (event === 'USER_UPDATED') {
            toast.success("User profile updated");
          }
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log("Getting session in provider:", session?.user?.email || "No session");
      
      if (error) {
        console.error("Error getting session:", error);
        if (isSubscribed) {
          toast.error("Authentication error", {
            description: "There was a problem verifying your login status"
          });
        }
      }
      
      if (isSubscribed) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    // Optional: You can also use this to enforce session duration client-side
    const checkSessionExpiration = () => {
      if (session) {
        // Check if session is expired
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        const expiryTime = session.expires_at || 0; // expires_at is in seconds
        
        // Force sign out if session is older than 8 hours
        // This is a fallback in case the server-side expiry doesn't work
        if (currentTime > expiryTime || (expiryTime - currentTime) > SESSION_DURATION_HOURS) {
          supabase.auth.signOut().then(() => {
            if (isSubscribed) {
              toast.info("Your session has expired. Please sign in again.");
            }
          });
        }
      }
    };

    // Check session expiration periodically
    const intervalId = setInterval(checkSessionExpiration, 60 * 1000); // Check every minute

    return () => {
      isSubscribed = false;
      subscription.unsubscribe();
      clearInterval(intervalId);
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      toast.success("Successfully signed out");
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
