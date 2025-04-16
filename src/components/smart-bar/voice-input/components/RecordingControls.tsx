
import { useSmartBar } from "../../context/SmartBarContext";
import { SmartBarButton } from "../../SmartBarButton";
import { Play, Pause, Stop, Trash2 } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface RecordingControlsProps {
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  cancelRecording: () => void;
  isSaving: boolean;
}

export function RecordingControls({
  pauseRecording,
  resumeRecording,
  stopRecording,
  cancelRecording,
  isSaving
}: RecordingControlsProps) {
  const { isPaused, recordingTime } = useSmartBar();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-3 h-3 rounded-full bg-red-500",
            isPaused ? "opacity-50" : "animate-pulse"
          )} />
          <span className="text-sm font-medium">Recording</span>
          <span className="text-sm text-muted-foreground">{formatTime(recordingTime)}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {isPaused ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-green-500 h-8 w-8"
              onClick={resumeRecording}
              disabled={isSaving}
            >
              <Play className="h-5 w-5" />
              <span className="sr-only">Resume</span>
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={pauseRecording}
              disabled={isSaving}
            >
              <Pause className="h-5 w-5" />
              <span className="sr-only">Pause</span>
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-red-500 h-8 w-8"
            onClick={cancelRecording}
            disabled={isSaving}
          >
            <Trash2 className="h-5 w-5" />
            <span className="sr-only">Cancel</span>
          </Button>
        </div>
      </div>
      
      <Button
        variant="default"
        className="bg-background/20 hover:bg-background/30 w-full text-foreground border border-border/50 flex justify-center py-2"
        onClick={stopRecording}
        disabled={isSaving}
      >
        {isSaving ? "Saving recording..." : "Stop and save recording"}
      </Button>
    </div>
  );
}
