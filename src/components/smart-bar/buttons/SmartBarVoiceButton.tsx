
import { Mic } from "lucide-react";
import { SmartBarButton } from "../SmartBarButton";
import { cn } from "@/lib/utils";
import { useSmartBar } from "../context/SmartBarContext";
import { useVoiceRecording } from "../voice-input/hooks/useVoiceRecording";
import { toast } from "sonner";

interface SmartBarVoiceButtonProps {
  className?: string;
  disabled?: boolean;
}

export function SmartBarVoiceButton({ className, disabled }: SmartBarVoiceButtonProps) {
  const { isRecording } = useSmartBar();
  const { startRecording } = useVoiceRecording();
  
  const handleClick = async () => {
    if (isRecording || disabled) return;
    
    try {
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser doesn't support voice recording");
      }
      
      // Request permission to use the microphone
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Permission granted, start recording
      startRecording();
      
    } catch (error) {
      // Handle permission denied or other errors
      console.error("Microphone access error:", error);
      
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Could not access microphone. Please check permissions.");
      }
    }
  };
  
  return (
    <>
      <SmartBarButton 
        icon={Mic} 
        tooltip={isRecording ? "Recording..." : "Voice Input"} 
        className={cn(
          "text-foreground", 
          isRecording && "text-red-500 animate-pulse shadow-[inset_2px_2px_5px_rgba(255,0,0,0.1)]",
          className
        )}
        onClick={handleClick}
        disabled={isRecording || disabled}
      />
      <VoiceRecordingPopover />
    </>
  );
}
