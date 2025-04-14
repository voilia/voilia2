
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
      if (isPasswordMode && data.password) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

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
  };

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

  return {
    form,
    isPasswordMode,
    isSubmitting,
    onSubmit,
    handleForgotPassword,
    togglePasswordMode,
  };
};
