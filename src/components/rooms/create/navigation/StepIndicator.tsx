
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: 1 | 2;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-2 mb-4">
      <div 
        className={cn(
          "w-2.5 h-2.5 rounded-full transition-colors",
          currentStep === 1 ? "bg-primary" : "bg-muted"
        )}
      />
      <div 
        className={cn(
          "w-2.5 h-2.5 rounded-full transition-colors",
          currentStep === 2 ? "bg-primary" : "bg-muted"
        )}
      />
    </div>
  );
}
