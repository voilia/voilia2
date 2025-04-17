
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

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

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
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
          supabase.auth.signOut();
        }
      }
    };

    // Check session expiration periodically
    const intervalId = setInterval(checkSessionExpiration, 60 * 1000); // Check every minute

    return () => {
      subscription.unsubscribe();
      clearInterval(intervalId);
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
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
