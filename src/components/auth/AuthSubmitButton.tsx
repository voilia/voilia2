
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AuthSubmitButtonProps {
  isSubmitting: boolean;
  isPasswordMode: boolean;
}

export const AuthSubmitButton = ({ isSubmitting, isPasswordMode }: AuthSubmitButtonProps) => {
  return (
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
  );
};
