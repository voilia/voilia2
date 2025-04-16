
import { useEffect, useState } from "react";
import { useSmartBar } from "../context/SmartBarContext";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import { Mic, MicOff, Pause, Play, StopCircle, Trash2 } from "lucide-react";
import { SmartBarButton } from "../SmartBarButton";
import { formatTime } from "@/lib/utils";

export function VoiceRecordingPopover() {
  const { 
    isRecording, 
    setIsRecording, 
    isPaused, 
    setIsPaused,
    recordingTime,
    setRecordingTime,
    setMessage
  } = useSmartBar();
  
  const [popoverWidth, setPopoverWidth] = useState<number | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Timer for recording duration
  useEffect(() => {
    let interval: number | undefined;
    
    if (isRecording && !isPaused) {
      interval = window.setInterval(() => {
        setRecordingTime(time => time + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, isPaused, setRecordingTime]);

  // Update popover position
  useEffect(() => {
    const updateSmartBarDimensions = () => {
      if (typeof window === 'undefined') return;
      
      const smartBarForm = document.querySelector('form.rounded-2xl');
      if (smartBarForm) {
        const rect = smartBarForm.getBoundingClientRect();
        
        setPopoverWidth(rect.width);
        setPopoverPosition({
          top: rect.top - 12,
          left: rect.left
        });
      }
    };
    
    if (isRecording) {
      updateSmartBarDimensions();
      window.addEventListener('resize', updateSmartBarDimensions);
      window.addEventListener('scroll', updateSmartBarDimensions);
      
      return () => {
        window.removeEventListener('resize', updateSmartBarDimensions);
        window.removeEventListener('scroll', updateSmartBarDimensions);
      };
    }
  }, [isRecording]);

  // Mock transcription - in a real app, you would call your transcription service
  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    
    try {
      // Simulate transcription delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // This would be replaced with actual API call to a transcription service
      // For now, return a mock result
      const mockTranscriptionResult = "This is a sample transcription of what the user said.";
      setMessage(prev => prev + (prev ? ' ' : '') + mockTranscriptionResult);
    } catch (error) {
      console.error("Transcription error:", error);
    } finally {
      setIsTranscribing(false);
      
      // Reset recording state
      setIsRecording(false);
      setIsPaused(false);
      setRecordingTime(0);
      setAudioChunks([]);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks(chunks => [...chunks, e.data]);
        }
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
        
        if (audioChunks.length > 0) {
          transcribeAudio(audioBlob);
        }
      };
      
      setMediaRecorder(recorder);
      recorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setAudioChunks([]);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder && isRecording && !isPaused) {
      mediaRecorder.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder && isRecording && isPaused) {
      mediaRecorder.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && (mediaRecorder.state === 'recording' || mediaRecorder.state === 'paused')) {
      mediaRecorder.stop();
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder) {
      // If we're recording, stop the recorder first to clean up
      if (mediaRecorder.state === 'recording' || mediaRecorder.state === 'paused') {
        mediaRecorder.stop();
      }
      
      // Release the microphone by stopping all tracks
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    
    // Reset recording state
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    setAudioChunks([]);
  };

  if (!isRecording && !isTranscribing) return null;
  
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
      {isTranscribing ? (
        <div className="py-2 flex items-center justify-center space-x-2">
          <div className="animate-pulse flex items-center">
            <div className="h-2 w-2 bg-primary rounded-full mr-1 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="h-2 w-2 bg-primary rounded-full mr-1 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
          </div>
          <span className="text-sm font-medium">Transcribing audio...</span>
        </div>
      ) : (
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
      )}
    </div>,
    document.body
  );
}
