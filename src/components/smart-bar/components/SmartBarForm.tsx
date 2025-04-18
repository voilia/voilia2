
import { useSmartBarForm } from "../hooks/useSmartBarForm";
import { SmartBarInput } from "../SmartBarInput";
import { AnimatedSubmitButton } from "../buttons/submit/AnimatedSubmitButton";
import { SmartBarModeSelector } from "../SmartBarModeSelector";
import { SmartBarFileButton } from "../buttons/SmartBarFileButton";
import { SmartBarVoiceButton } from "../buttons/SmartBarVoiceButton";
import { cn } from "@/lib/utils";
import { useSmartBar } from "../context/SmartBarContext";

export function SmartBarForm({
  onSendMessage,
  isDisabled = false,
}: {
  onSendMessage: (message: string, files?: File[]) => Promise<void>;
  isDisabled?: boolean;
}) {
  const { handleSubmit, handleKeyDown, isSubmitting } = useSmartBarForm({ onSendMessage, isDisabled });
  const { mode, message, setMessage } = useSmartBar();

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className={cn(
        "flex flex-col gap-4 py-3 px-4",
        "backdrop-blur-sm transition-all duration-300"
      )}>
        <SmartBarInput
          value={message}
          onChange={(value) => setMessage(value)}
          onKeyDown={handleKeyDown}
          isDisabled={isDisabled || isSubmitting}
          placeholder="Ask anything or use @ to mention a model..."
          id="smart-bar-input"
          name="message-input"
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SmartBarModeSelector />
            <SmartBarFileButton disabled={isDisabled} />
          </div>
          
          <div className="flex items-center gap-3">
            <SmartBarVoiceButton disabled={isDisabled} />
            <AnimatedSubmitButton 
              disabled={isDisabled || isSubmitting} 
              mode={mode}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
