
import { useSmartBar } from "../context/SmartBarContext";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import { usePopoverPosition } from "./hooks/usePopoverPosition";
import { useVoiceRecording } from "./hooks/useVoiceRecording";
import { RecordingControls } from "./components/RecordingControls";

export function VoiceRecordingPopover() {
  const { isRecording } = useSmartBar();
  const { popoverWidth, popoverPosition } = usePopoverPosition();
  const { 
    pauseRecording, 
    resumeRecording, 
    stopRecording, 
    cancelRecording,
    isSaving
  } = useVoiceRecording();
  
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!isRecording) return null;
  
  return createPortal(
    <div 
      className={cn(
        "voice-recording-popover fixed z-50",
        "shadow-lg transition-all duration-200 rounded-2xl p-3",
        isDark 
          ? "bg-black/30 border-white/10" 
          : "bg-foreground/5 border-foreground/10",
        "backdrop-blur-lg border"
      )}
      style={{
        width: popoverWidth ? `${popoverWidth}px` : 'auto',
        top: `${popoverPosition.top}px`,
        left: `${popoverPosition.left}px`,
        transform: 'translateY(-100%)',
      }}
    >
      <RecordingControls 
        pauseRecording={pauseRecording}
        resumeRecording={resumeRecording}
        stopRecording={stopRecording}
        cancelRecording={cancelRecording}
        isSaving={isSaving}
      />
    </div>,
    document.body
  );
}
