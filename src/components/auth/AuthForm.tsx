
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
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import GoogleSignIn from "./GoogleSignIn";
import { Separator } from "@/components/ui/separator";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().optional(),
});

type AuthFormValues = z.infer<typeof authSchema>;

const AuthForm = () => {
  const [isPasswordMode, setIsPasswordMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
            options: {
              emailRedirectTo: `${window.location.origin}/home`,
            },
          });

          if (signUpError) {
            toast.error(signUpError.message);
          } else {
            toast.success("Check your email to confirm your account");
          }
        } else if (signInError) {
          toast.error(signInError.message);
        }
      } else {
        // Sign in with magic link
        const { error } = await supabase.auth.signInWithOtp({
          email: data.email,
          options: {
            emailRedirectTo: `${window.location.origin}/home`,
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

  const handleForgotPassword = async () => {
    const email = form.getValues("email");
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/home`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Check your email for password reset instructions");
      }
    } catch (error) {
      toast.error("Failed to send password reset email");
    }
  };

  const togglePasswordMode = () => {
    setIsPasswordMode(!isPasswordMode);
    if (!isPasswordMode) {
      form.register("password", { required: "Password is required" });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-card p-6 transition-all duration-300 hover:shadow-lg">
        <GoogleSignIn />
        
        <div className="flex items-center justify-center text-muted-foreground text-sm my-4">
          <span className="flex-grow border-t border-border/40" />
          <span className="mx-2">or continue with email</span>
          <span className="flex-grow border-t border-border/40" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="name@example.com" 
                      {...field} 
                      className="transition-all duration-200 focus:ring-2 ring-primary/40"
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
                  <FormItem className="animate-fade-in space-y-2">
                    <div className="relative">
                      <FormControl>
                        <Input 
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••" 
                          {...field} 
                          className="pr-10 transition-all duration-200 focus:ring-2 ring-primary/40"
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <FormMessage className="animate-fade-in" />
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-primary hover:underline focus:outline-none transition-colors"
                    >
                      Forgot your password?
                    </button>
                  </FormItem>
                )}
              />
            )}

            <div className="text-sm text-center">
              {isPasswordMode ? (
                <button 
                  type="button" 
                  onClick={togglePasswordMode}
                  className="text-primary hover:underline focus:outline-none transition-colors"
                >
                  Use magic link instead
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={togglePasswordMode}
                  className="text-primary hover:underline focus:outline-none transition-colors"
                >
                  Prefer using a password?
                </button>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full transition-all duration-200 hover:shadow-md"
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
    </div>
  );
};

export default AuthForm;
