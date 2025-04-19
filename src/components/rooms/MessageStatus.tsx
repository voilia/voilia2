
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface MessageStatusProps {
  time: string;
  isPending?: boolean;
  align: "left" | "right";
}

export function MessageStatus({ time, isPending, align }: MessageStatusProps) {
  return (
    <div className={cn(
      "text-xs text-muted-foreground mt-1 flex items-center gap-1",
      align === "right" ? "text-right justify-end" : "text-left justify-start"
    )}>
      {isPending && <Loader2 className="h-3 w-3 animate-spin opacity-70" />}
      <span>{time}</span>
    </div>
  );
}
