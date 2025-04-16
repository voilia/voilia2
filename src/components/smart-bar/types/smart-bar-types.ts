
export type SmartBarMode = "chat" | "visual" | "assist" | "vault";

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  type: string;
  size: number;
  preview: string | null;
}

export interface SmartBarContextType {
  message: string;
  setMessage: (message: string) => void;
  mode: SmartBarMode;
  setMode: (mode: SmartBarMode) => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  enterSends: boolean;
  setEnterSends: (enterSends: boolean) => void;
  
  // File upload
  uploadedFiles: UploadedFile[];
  setUploadedFiles: (files: UploadedFile[]) => void;
  isDraggingOver: boolean;
  setIsDraggingOver: (isDragging: boolean) => void;
  addFiles: (files: File[]) => void;
  removeFile: (fileId: string) => void;
  clearFiles: () => void;
  
  // Voice recording
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  isPaused: boolean;
  setIsPaused: (isPaused: boolean) => void;
  recordingTime: number;
  setRecordingTime: (time: number) => void;
}
