
import { AtomIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: "sm" | "default" | "lg";
  showText?: boolean;
}

export function Loader({ className, size = "default", showText = true }: LoaderProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center gap-3",
      className
    )}>
      <div className="relative">
        {/* Outer ring */}
        <div className={cn(
          "rounded-full border-2 border-t-primary border-r-primary/30 border-b-primary/10 border-l-primary/50",
          "animate-[spin_3s_linear_infinite]",
          size === "sm" && "h-6 w-6",
          size === "default" && "h-10 w-10",
          size === "lg" && "h-16 w-16"
        )} />
        
        {/* Center icon */}
        <AtomIcon className={cn(
          "absolute inset-0 text-primary/80 animate-pulse",
          size === "sm" && "h-6 w-6 p-1",
          size === "default" && "h-10 w-10 p-2",
          size === "lg" && "h-16 w-16 p-3"
        )} />
      </div>
      
      {showText && (
        <p className={cn(
          "text-center font-medium text-muted-foreground animate-pulse",
          size === "sm" && "text-xs",
          size === "default" && "text-sm",
          size === "lg" && "text-base"
        )}>
          Loading VOILIA
        </p>
      )}
    </div>
  );
}
