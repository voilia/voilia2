
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { AuthEmailInput } from "./AuthEmailInput";
import { AuthPasswordInput } from "./AuthPasswordInput";
import { AuthToggleMode } from "./AuthToggleMode";
import { AuthSubmitButton } from "./AuthSubmitButton";
import GoogleSignIn from "./GoogleSignIn";
import { useAuthForm } from "@/hooks/useAuthForm";

const AuthForm = () => {
  const {
    form,
    isPasswordMode,
    isSubmitting,
    onSubmit,
    handleForgotPassword,
    togglePasswordMode,
  } = useAuthForm();

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
