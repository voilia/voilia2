
import { useState } from "react";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { AuthFormValues } from "./types";

interface AuthPasswordInputProps {
  form: UseFormReturn<AuthFormValues>;
  onForgotPassword: () => void;
}

export const AuthPasswordInput = ({ form, onForgotPassword }: AuthPasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
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
            onClick={onForgotPassword}
            className="text-sm text-primary hover:underline focus:outline-none transition-colors"
          >
            Forgot your password?
          </button>
        </FormItem>
      )}
    />
  );
};
