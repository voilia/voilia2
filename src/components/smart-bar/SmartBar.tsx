
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
        "fixed pb-2 bg-background/95 backdrop-blur-sm border-t border-border/40",
        isMobile ? "bottom-0 left-0 right-0 px-2" : "bottom-0 px-4",
        "relative"
      )}
      style={{
        left: isMobile ? '0' : 'var(--sidebar-width, 0px)',
        right: '0',
        maxWidth: isMobile ? '100%' : 'none',
        transition: 'left 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 40
      }}
    >
      <ColoredModeIndicator mode={mode} />
      <div className="mx-auto max-w-3xl w-full transition-transform duration-300 ease-out">
        <SmartBarForm
          onSendMessage={onSendMessage}
          isDisabled={isDisabled}
        />
        <SmartBarFooter 
          enterSends={enterSends}
          onToggleEnterSends={() => setEnterSends(!enterSends)}
          className=""
        />
      </div>
    </div>
  );
}
