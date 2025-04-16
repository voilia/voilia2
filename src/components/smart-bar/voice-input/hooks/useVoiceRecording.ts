
import { useState, useEffect } from "react";
import { useSmartBar } from "../../context/SmartBarContext";

export function useVoiceRecording() {
  const { 
    isRecording, 
    setIsRecording, 
    isPaused, 
    setIsPaused,
    recordingTime,
    setRecordingTime,
    setMessage
  } = useSmartBar();
  
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);

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

  // Mock transcription - in a real app, you would call your transcription service
  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    
    try {
      // Simulate transcription delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // This would be replaced with actual API call to a transcription service
      // For now, return a mock result
      const mockTranscriptionResult = "This is a sample transcription of what the user said.";
      setMessage(prevMessage => prevMessage + (prevMessage ? ' ' : '') + mockTranscriptionResult);
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

  return {
    isTranscribing,
    pauseRecording,
    resumeRecording,
    stopRecording,
    cancelRecording
  };
}
