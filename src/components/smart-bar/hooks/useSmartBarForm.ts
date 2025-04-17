
import { FormEvent } from "react";
import { useSmartBar } from "../context/SmartBarContext";
import { toast } from "sonner";

interface UseSmartBarFormProps {
  onSendMessage: (message: string, files?: File[]) => Promise<void>;
  isDisabled?: boolean;
}

export function useSmartBarForm({ onSendMessage, isDisabled }: UseSmartBarFormProps) {
  const { 
    message, 
    setMessage, 
    isSubmitting,
    setIsSubmitting,
    uploadedFiles,
    clearFiles,
    enterSends 
  } = useSmartBar();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && uploadedFiles.length === 0) || isDisabled || isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      if (uploadedFiles.length > 0) {
        const fileNames = uploadedFiles.map(f => f.name).join(", ");
        const combinedText = message 
          ? `${message}\n\nAttached files: ${fileNames}` 
          : `Attached files: ${fileNames}`;
        
        await onSendMessage(combinedText, uploadedFiles.map(f => f.file));
      } else {
        await onSendMessage(message);
      }
      
      setMessage("");
      clearFiles();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && enterSends) {
      if ((!message.trim() && uploadedFiles.length === 0) || isDisabled || isSubmitting) return;
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  return {
    handleSubmit,
    handleKeyDown,
    isSubmitting
  };
}
