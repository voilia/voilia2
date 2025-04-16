
import { useState, useEffect } from "react";
import { useSmartBar } from "../../context/SmartBarContext";
import { toast } from "sonner";

export function useVoiceRecording() {
  const { 
    isRecording, 
    setIsRecording, 
    isPaused, 
    setIsPaused,
    recordingTime,
    setRecordingTime,
    setAudioRecordingData,
    saveRecording
  } = useSmartBar();
  
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Timer for recording duration
  useEffect(() => {
    let interval: number | undefined;
    
    if (isRecording && !isPaused) {
      interval = window.setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, isPaused, setRecordingTime]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks(chunks => [...chunks, e.data]);
        }
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        setAudioRecordingData(audioBlob);
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
        
        if (audioChunks.length > 0 && !isSaving) {
          // The actual saving happens in the calling component
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
      toast.error("Could not access microphone. Please check permissions.");
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

  const stopRecording = async () => {
    if (mediaRecorder && (mediaRecorder.state === 'recording' || mediaRecorder.state === 'paused')) {
      setIsSaving(true);
      mediaRecorder.stop();
      
      // Give time for the onstop event to fire and process the data
      setTimeout(async () => {
        await saveRecording();
        
        // Reset recording state
        setIsRecording(false);
        setIsPaused(false);
        setAudioChunks([]);
        setIsSaving(false);
      }, 300);
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
    setAudioRecordingData(null);
  };

  return {
    startRecording,
    isSaving,
    pauseRecording,
    resumeRecording,
    stopRecording,
    cancelRecording
  };
}
