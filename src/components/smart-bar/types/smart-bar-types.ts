
export type SmartBarMode = "chat" | "visual" | "assist" | "vault";

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  type: string;
  size: number;
  preview: string | null;
  isRecording?: boolean;
  duration?: number;
}

export interface SmartBarContextType {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  mode: SmartBarMode;
  setMode: (mode: SmartBarMode) => void;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  enterSends: boolean;
  setEnterSends: (enterSends: boolean) => void;
  
  // File upload
  uploadedFiles: UploadedFile[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  isDraggingOver: boolean;
  setIsDraggingOver: React.Dispatch<React.SetStateAction<boolean>>;
  addFiles: (files: File[]) => void;
  removeFile: (fileId: string) => void;
  clearFiles: () => void;
  
  // Voice recording
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  isPaused: boolean;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  recordingTime: number;
  setRecordingTime: React.Dispatch<React.SetStateAction<number>>;
  audioRecordingData: Blob | null;
  setAudioRecordingData: React.Dispatch<React.SetStateAction<Blob | null>>;
  saveRecording: () => Promise<void>;
}
