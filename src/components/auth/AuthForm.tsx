
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { AuthEmailInput } from "./AuthEmailInput";
import { AuthPasswordInput } from "./AuthPasswordInput";
import { AuthToggleMode } from "./AuthToggleMode";
import { AuthSubmitButton } from "./AuthSubmitButton";
import GoogleSignIn from "./GoogleSignIn";
import { authSchema, type AuthFormValues } from "./types";

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
      <GoogleSignIn />
      
      <div className="flex items-center justify-center text-muted-foreground text-sm my-4">
        <span className="flex-grow border-t border-border/40" />
        <span className="mx-2">or continue with email</span>
        <span className="flex-grow border-t border-border/40" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <AuthEmailInput form={form} />

          {isPasswordMode && (
            <AuthPasswordInput 
              form={form} 
              onForgotPassword={handleForgotPassword} 
            />
          )}

          <AuthToggleMode 
            isPasswordMode={isPasswordMode} 
            onToggle={togglePasswordMode}
          />

          <AuthSubmitButton 
            isSubmitting={isSubmitting} 
            isPasswordMode={isPasswordMode}
          />
        </form>
      </Form>
    </div>
  );
};

export default AuthForm;
