
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { AuthFormValues } from "./types";

interface AuthEmailInputProps {
  form: UseFormReturn<AuthFormValues>;
}

export const AuthEmailInput = ({ form }: AuthEmailInputProps) => {
  return (
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
  );
};
