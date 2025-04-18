
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://uqnatcywnnttjxweomud.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxbmF0Y3l3bm50dGp4d2VvbXVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNDk1OTMsImV4cCI6MjA1OTgyNTU5M30.uzj9UgcQLjpbAOXMDF_zN-3sC7ELe3LsArQTMmb8oG4";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  db: {
    schema: 'public',
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'voilia-auth-session',
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  global: {
    fetch: (url, options) => {
      return fetch(url, options).then(async (response) => {
        if (!response.ok) {
          const clonedResponse = response.clone();
          try {
            const errorData = await clonedResponse.json();
            console.error('Supabase request failed:', {
              url,
              status: response.status,
              statusText: response.statusText,
              errorData
            });
          } catch (e) {
            console.error('Supabase request failed:', {
              url,
              status: response.status,
              statusText: response.statusText,
              error: 'Could not parse response'
            });
          }
        }
        return response;
      });
    }
  }
});

// Debug authentication issues
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session?.user?.email || 'No user');
});
