
import { FormEvent } from "react";
import { useSmartBar } from "../context/SmartBarContext";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";

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
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && uploadedFiles.length === 0) || isDisabled || isSubmitting) return;

    // Check authentication
    if (!user) {
      toast.error("Authentication required", {
        description: "Please log in to send messages"
      });
      navigate('/auth');
      return;
    }

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
      // Toast is handled in the submitSmartBarMessage function
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
