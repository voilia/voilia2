
import { useSmartBar } from "../../context/SmartBarContext";
import { SmartBarButton } from "../../SmartBarButton";
import { Play, Pause, StopCircle, Trash2 } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface RecordingControlsProps {
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  cancelRecording: () => void;
}

export function RecordingControls({
  pauseRecording,
  resumeRecording,
  stopRecording,
  cancelRecording
}: RecordingControlsProps) {
  const { isPaused, recordingTime } = useSmartBar();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className={cn(
          "w-3 h-3 rounded-full bg-red-500",
          isPaused ? "opacity-50" : "animate-pulse"
        )} />
        <span className="text-sm font-medium">Recording</span>
        <span className="text-sm text-muted-foreground">{formatTime(recordingTime)}</span>
      </div>
      
      <div className="flex items-center space-x-1">
        {isPaused ? (
          <SmartBarButton 
            icon={Play} 
            tooltip="Resume" 
            onClick={resumeRecording}
            size="sm"
          />
        ) : (
          <SmartBarButton 
            icon={Pause} 
            tooltip="Pause" 
            onClick={pauseRecording}
            size="sm"
          />
        )}
        
        <SmartBarButton 
          icon={StopCircle} 
          tooltip="Stop and transcribe" 
          onClick={stopRecording}
          size="sm"
          customColor="#22c55e"
        />
        
        <SmartBarButton 
          icon={Trash2} 
          tooltip="Cancel recording" 
          onClick={cancelRecording}
          size="sm"
          customColor="#ef4444"
        />
      </div>
    </div>
  );
}
