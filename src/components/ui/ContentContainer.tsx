
import { cn } from "@/lib/utils";

interface ContentContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function ContentContainer({ 
  children, 
  className, 
  noPadding = false 
}: ContentContainerProps) {
  return (
    <div 
      className={cn(
        "w-full",
        !noPadding && "px-4 md:px-6 lg:px-8",
        className
      )}
    >
      <div className="w-full mx-auto max-w-[1200px]">
        {children}
      </div>
    </div>
  );
}
