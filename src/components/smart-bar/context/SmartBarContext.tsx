
import React, { createContext, useContext, useState } from 'react';
import type { SmartBarContextType, SmartBarMode, UploadedFile } from '../types/smart-bar-types';

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

  const removeFile = (fileId: string) => {
    setUploadedFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
  };

  const addFiles = (files: File[]) => {
    const newFiles = files.map(file => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      file,
      name: file.name,
      type: file.type,
      size: file.size,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const clearFiles = () => {
    // Revoke any object URLs to prevent memory leaks
    uploadedFiles.forEach(file => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
    setUploadedFiles([]);
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
