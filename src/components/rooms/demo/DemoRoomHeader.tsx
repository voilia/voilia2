
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEMO_AGENT_CONFIG } from "@/config/demo-constants";
import { cn } from "@/lib/utils";

interface DemoRoomHeaderProps {
  onBackClick: () => void;
}

export function DemoRoomHeader({ onBackClick }: DemoRoomHeaderProps) {
  return (
    <div className={cn(
      "sticky top-0 z-10",
      "flex items-center gap-2 p-4 border-b",
      "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    )}>
      <Button
        variant="ghost"
        size="icon"
        className="mr-2"
        onClick={onBackClick}
        aria-label="Go back"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-3">
        <div 
          className={cn(
            "flex items-center justify-center",
            "w-10 h-10 rounded-xl text-base",
            "transition-all duration-300 transform hover:scale-105"
          )}
          style={{ backgroundColor: DEMO_AGENT_CONFIG.color }}
        >
          <span>{DEMO_AGENT_CONFIG.icon}</span>
        </div>
        <div className="flex flex-col">
          <div className="font-semibold flex items-center gap-2">
            {DEMO_AGENT_CONFIG.name}
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">
              Live
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Experience the next generation of AI collaboration
          </div>
        </div>
      </div>
    </div>
  );
}
