
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import GoogleSignIn from "./GoogleSignIn";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().optional(),
});

type AuthFormValues = z.infer<typeof authSchema>;

const AuthForm = () => {
  const [isPasswordMode, setIsPasswordMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: AuthFormValues) {
    setIsSubmitting(true);
    
    try {
      if (isPasswordMode && data.password) {
        // Sign in with password
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        // If no account exists or wrong password, try to sign up
        if (signInError && signInError.message.includes("Invalid login credentials")) {
          const { error: signUpError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
          });

          if (signUpError) {
            toast.error(signUpError.message);
          }
        } else if (signInError) {
          toast.error(signInError.message);
        }
      } else {
        // Sign in with magic link
        const { error } = await supabase.auth.signInWithOtp({
          email: data.email,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Check your email for the login link");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const togglePasswordMode = () => {
    setIsPasswordMode(!isPasswordMode);
    if (!isPasswordMode) {
      // Add validation for password when switching to password mode
      form.register("password", { required: "Password is required" });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <GoogleSignIn />
      
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-border/40"></div>
        <span className="flex-shrink mx-4 text-xs text-muted-foreground">or continue with email</span>
        <div className="flex-grow border-t border-border/40"></div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="name@example.com" 
                    {...field} 
                    className="transition-all duration-200"
                  />
                </FormControl>
                <FormMessage className="animate-fade-in" />
              </FormItem>
            )}
          />

          {isPasswordMode && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="animate-fade-in">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field} 
                      className="transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage className="animate-fade-in" />
                </FormItem>
              )}
            />
          )}

          <div className="text-sm text-center">
            {isPasswordMode ? (
              <button 
                type="button" 
                onClick={togglePasswordMode}
                className="text-primary hover:underline focus:outline-none"
              >
                Switch to magic link
              </button>
            ) : (
              <button 
                type="button" 
                onClick={togglePasswordMode}
                className="text-primary hover:underline focus:outline-none"
              >
                Prefer using a password?
              </button>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>{isPasswordMode ? "Signing in..." : "Sending link..."}</span>
              </>
            ) : (
              <span>{isPasswordMode ? "Sign in with password" : "Send magic link"}</span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AuthForm;
