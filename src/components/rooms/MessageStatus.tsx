
import { cn } from "@/lib/utils";

interface MessageStatusProps {
  time: string;
  isPending?: boolean;
  align: "left" | "right";
}

export function MessageStatus({ time, align }: MessageStatusProps) {
  return (
    <div className={cn(
      "text-xs text-muted-foreground mt-1",
      align === "right" ? "text-right" : "text-left"
    )}>
      {time}
    </div>
  );
}
