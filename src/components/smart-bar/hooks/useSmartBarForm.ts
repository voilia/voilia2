
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
      
      // Convert uploadedFiles to regular File objects
      const files = uploadedFiles.length > 0 ? uploadedFiles.map(f => f.file) : undefined;
      
      // Send the message with files if available
      await onSendMessage(message, files);
      
      // Clear the message and files after successful submission
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
