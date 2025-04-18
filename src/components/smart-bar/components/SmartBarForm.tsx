
import { SmartBarInput } from "../SmartBarInput";
import { SmartBarActions } from "../buttons/SmartBarActions";
import { useSmartBar } from "../context/SmartBarContext";
import { useSmartBarForm } from "../hooks/useSmartBarForm";
import { AnimatedSubmitButton } from "../buttons/submit/AnimatedSubmitButton";

interface SmartBarFormProps {
  onSendMessage: (message: string, files?: File[]) => Promise<void>;
  isDisabled?: boolean;
}

export function SmartBarForm({ onSendMessage, isDisabled = false }: SmartBarFormProps) {
  const { message, setMessage, mode } = useSmartBar();
  const { handleSubmit, handleKeyDown, isSubmitting } = useSmartBarForm({
    onSendMessage,
    isDisabled
  });

  return (
    <form onSubmit={handleSubmit} className="relative rounded-xl md:rounded-2xl overflow-hidden border transition-colors duration-200 min-h-[90px] md:min-h-24 max-w-3xl mx-auto">
      <SmartBarInput
        value={message}
        onChange={setMessage}
        onKeyDown={handleKeyDown}
        isDisabled={isDisabled}
        isSubmitting={isSubmitting}
      />
      <div className="flex items-center justify-between px-3 py-2">
        <SmartBarActions disabled={isDisabled || isSubmitting} />
        <AnimatedSubmitButton 
          disabled={isDisabled || isSubmitting || !message.trim()} 
          mode={mode} 
          className="ml-2"
        />
      </div>
    </form>
  );
}
