
import { SmartBarForm } from "./components/SmartBarForm";
import { SmartBarFooter } from "./SmartBarFooter";
import { useSmartBar } from "./context/SmartBarContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { RoomMessage } from "@/types/room-messages";
import { cn } from "@/lib/utils";
import { ColoredModeIndicator } from "./buttons/mode-selector/ColoredModeIndicator";

interface SmartBarProps {
  onSendMessage: (message: string, files?: File[]) => Promise<void>;
  isDisabled?: boolean;
  projectId?: string | null;
  addLocalMessage?: (message: RoomMessage) => void;
  room?: {
    name?: string;
    project_id?: string;
    projects?: {
      name: string;
      color: string;
    };
  };
  isLoading: boolean;
}

export function SmartBar({ 
  onSendMessage, 
  isDisabled = false,
  projectId = null,
  addLocalMessage,
  room,
  isLoading
}: SmartBarProps) {
  const { enterSends, setEnterSends, mode } = useSmartBar();
  const isMobile = useIsMobile();

  return (
    <div 
      className={cn(
        "fixed bottom-0 bg-background border-t border-border/40",
        "w-full transition-all duration-300 ease-out z-40",
        isMobile ? "px-2" : "px-4"
      )}
      style={{
        left: isMobile ? '0' : 'var(--sidebar-width, 0px)',
        right: '0',
        maxWidth: isMobile ? '100%' : 'none'
      }}
    >
      <div className="relative max-w-3xl mx-auto w-full rounded-t-2xl bg-background/95 backdrop-blur-sm">
        <ColoredModeIndicator mode={mode} className="absolute -top-px inset-x-0 w-full rounded-t-2xl" />
        <SmartBarForm
          onSendMessage={onSendMessage}
          isDisabled={isDisabled}
        />
        <SmartBarFooter 
          enterSends={enterSends}
          onToggleEnterSends={() => setEnterSends(!enterSends)}
        />
      </div>
    </div>
  );
}
