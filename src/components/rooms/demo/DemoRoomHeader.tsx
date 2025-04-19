
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEMO_AGENT_CONFIG } from "@/config/demo-constants";

interface DemoRoomHeaderProps {
  onBackClick: () => void;
}

export function DemoRoomHeader({ onBackClick }: DemoRoomHeaderProps) {
  return (
    <div className="flex items-center gap-2 p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
          className="flex items-center justify-center w-8 h-8 rounded-full text-sm"
          style={{ backgroundColor: DEMO_AGENT_CONFIG.color }}
        >
          <span>{DEMO_AGENT_CONFIG.icon}</span>
        </div>
        <div className="flex flex-col">
          <div className="font-semibold">{DEMO_AGENT_CONFIG.name}</div>
          <div className="text-xs text-muted-foreground">
            Demo Room - New VOILIA Experience
          </div>
        </div>
      </div>
      
      <div className="ml-auto flex items-center gap-2">
        <div className="bg-green-500 h-2 w-2 rounded-full"></div>
        <span className="text-xs text-muted-foreground">Live Demo</span>
      </div>
    </div>
  );
}
