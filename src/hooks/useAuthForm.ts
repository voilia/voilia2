
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthFormValues, authSchema } from "@/components/auth/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuthForm = () => {
  const [isPasswordMode, setIsPasswordMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AuthFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log("Auth form submitted:", isPasswordMode ? "password mode" : "magic link mode");
      
      if (isPasswordMode && data.password) {
        // Password login flow
        console.log("Attempting password login for:", data.email);
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (signInError) {
          console.log("Sign in error:", signInError.message);
          
          if (signInError.message.includes("Invalid login credentials")) {
            console.log("Invalid credentials, attempting sign up");
            // If sign in fails with invalid credentials, try to sign up
            const { error: signUpError } = await supabase.auth.signUp({
              email: data.email,
              password: data.password,
              options: {
                emailRedirectTo: window.location.origin,
              },
            });

            if (signUpError) {
              console.error("Sign up error:", signUpError);
              toast.error(signUpError.message);
            } else {
              toast.success("Check your email to confirm your account");
            }
          } else {
            toast.error(signInError.message);
          }
        } else {
          console.log("Password login successful");
        }
      } else {
        // Magic link flow
        console.log("Sending magic link to:", data.email);
        const { error } = await supabase.auth.signInWithOtp({
          email: data.email,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) {
          console.error("OTP error:", error);
          toast.error(error.message);
        } else {
          toast.success("Check your email for the login link");
        }
      }
    } catch (error) {
      console.error("Unexpected auth error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = form.getValues("email");
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });

      if (error) {
        console.error("Password reset error:", error);
        toast.error(error.message);
      } else {
        toast.success("Check your email for password reset instructions");
      }
    } catch (error) {
      console.error("Unexpected password reset error:", error);
      toast.error("Failed to send password reset email");
    }
  };

  const togglePasswordMode = () => {
    setIsPasswordMode(!isPasswordMode);
    if (!isPasswordMode) {
      form.register("password", { required: "Password is required" });
    }
  };

  return {
    form,
    isPasswordMode,
    isSubmitting,
    onSubmit,
    handleForgotPassword,
    togglePasswordMode,
  };
};
