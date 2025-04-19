
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface MessageStatusProps {
  time?: string;
  timestamp?: string;
  isPending?: boolean;
  align: "left" | "right";
}

export function MessageStatus({ time, timestamp, isPending, align }: MessageStatusProps) {
  const [formattedTime, setFormattedTime] = useState(time || "");

  // Update the timestamp in real-time
  useEffect(() => {
    if (!timestamp) return;
    
    // Update immediately
    const updateTime = () => {
      setFormattedTime(formatDistanceToNow(new Date(timestamp), { addSuffix: true }));
    };
    
    // Update now
    updateTime();
    
    // Then update every 10 seconds 
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, [timestamp]);

  return (
    <div className={cn(
      "text-xs text-muted-foreground mt-1 flex items-center gap-1",
      align === "right" ? "text-right justify-end" : "text-left justify-start"
    )}>
      {isPending && <Loader2 className="h-3 w-3 animate-spin opacity-70" />}
      <span>{formattedTime}</span>
    </div>
  );
}
