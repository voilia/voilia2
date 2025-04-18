
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SmartBarContextType, SmartBarMode, UploadedFile } from '../types/smart-bar-types';
import { toast } from 'sonner';

const SmartBarContext = createContext<SmartBarContextType | undefined>(undefined);

export function SmartBarProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<SmartBarMode>("chat");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enterSends, setEnterSends] = useState(true);
  
  // File upload states
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioRecordingData, setAudioRecordingData] = useState<Blob | null>(null);

  // Debug log for files
  useEffect(() => {
    if (uploadedFiles.length > 0) {
      console.info(`SmartBarContext has ${uploadedFiles.length} files ready to display`);
    }
  }, [uploadedFiles]);

  const removeFile = (fileId: string) => {
    setUploadedFiles(prevFiles => {
      const fileToRemove = prevFiles.find(file => file.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prevFiles.filter(file => file.id !== fileId);
    });
  };

  const addFiles = (files: File[]) => {
    const MAX_FILES = 10;
    const totalFiles = uploadedFiles.length + files.length;
    
    if (totalFiles > MAX_FILES) {
      toast.warning(`You can upload a maximum of ${MAX_FILES} files at once.`);
      const filesCanAdd = MAX_FILES - uploadedFiles.length;
      if (filesCanAdd <= 0) return; // We're already at or over the limit
      
      // Add only as many files as we can
      files = files.slice(0, filesCanAdd);
    }
    
    const newFiles = files.map(file => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      file,
      name: file.name,
      type: file.type,
      size: file.size,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));

    console.info(`Adding ${newFiles.length} files to context`);
    
    setUploadedFiles(prev => {
      const updated = [...prev, ...newFiles];
      console.info(`Context now has ${updated.length} files`);
      return updated;
    });
    
    // Show success toast
    if (files.length > 0) {
      toast.success(`Added ${files.length} ${files.length === 1 ? 'file' : 'files'}`, {
        duration: 2000
      });
    }
  };

  const clearFiles = () => {
    // Revoke any object URLs to prevent memory leaks
    uploadedFiles.forEach(file => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
    setUploadedFiles([]);
    console.info("Cleared all files");
  };
  
  // Save the current recording as a file
  const saveRecording = async () => {
    if (!audioRecordingData) {
      toast.error("No recording data available");
      return;
    }
    
    try {
      // Create a filename with timestamp for uniqueness
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `voice-recording-${timestamp}.webm`;
      
      // Create a File object from the Blob
      const audioFile = new File([audioRecordingData], fileName, { 
        type: 'audio/webm',
        lastModified: Date.now() 
      });
      
      // Create an audio element to get duration 
      const audioElement = new Audio(URL.createObjectURL(audioRecordingData));
      
      // Wait for the metadata to load to get duration
      await new Promise<void>((resolve) => {
        audioElement.onloadedmetadata = () => {
          resolve();
        };
        // If metadata fails to load, resolve anyway after a timeout
        setTimeout(() => resolve(), 1000);
      });
      
      // Round the duration to nearest second
      const duration = Math.round(audioElement.duration || recordingTime);
      
      // Add the recording to files
      const newFile: UploadedFile = {
        id: `recording-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        file: audioFile,
        name: fileName,
        type: audioFile.type,
        size: audioFile.size,
        preview: null,
        isRecording: true,
        duration: duration
      };
      
      setUploadedFiles(prev => [...prev, newFile]);
      
      // Reset recording state
      setAudioRecordingData(null);
      setRecordingTime(0);
      
      toast.success("Recording saved successfully");
    } catch (error) {
      console.error("Error saving recording:", error);
      toast.error("Failed to save recording");
    }
  };

  return (
    <SmartBarContext.Provider 
      value={{
        message,
        setMessage,
        mode,
        setMode,
        isSubmitting,
        setIsSubmitting,
        enterSends,
        setEnterSends,
        
        // File upload
        uploadedFiles,
        setUploadedFiles,
        isDraggingOver,
        setIsDraggingOver,
        addFiles,
        removeFile,
        clearFiles,
        
        // Voice recording
        isRecording,
        setIsRecording,
        isPaused,
        setIsPaused,
        recordingTime,
        setRecordingTime,
        audioRecordingData,
        setAudioRecordingData,
        saveRecording,
      }}
    >
      {children}
    </SmartBarContext.Provider>
  );
}

export function useSmartBar() {
  const context = useContext(SmartBarContext);
  if (context === undefined) {
    throw new Error('useSmartBar must be used within a SmartBarProvider');
  }
  return context;
}
