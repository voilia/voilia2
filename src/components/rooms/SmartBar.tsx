
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface SmartBarProps {
  onSendMessage: (message: string) => Promise<void>;
  isDisabled?: boolean;
  placeholder?: string;
}

export function SmartBar({ 
  onSendMessage, 
  isDisabled = false,
  placeholder = "Type a message..." 
}: SmartBarProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting || isDisabled) return;

    try {
      setIsSubmitting(true);
      await onSendMessage(message);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-background border-t border-border p-3 shadow-sm">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            disabled={isDisabled || isSubmitting}
            className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
          />
        </div>
        <Button 
          type="submit" 
          size="icon" 
          disabled={!message.trim() || isDisabled || isSubmitting}
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
