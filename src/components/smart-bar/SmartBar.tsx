
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
        "fixed bottom-6 bg-transparent",
        "w-full transition-all duration-300 ease-out z-40",
        isMobile ? "px-3" : "px-4"
      )}
      style={{
        left: isMobile ? '0' : 'var(--sidebar-width, 0px)',
        right: '0',
        maxWidth: isMobile ? '100%' : 'calc(100% - var(--sidebar-width, 0px))'
      }}
    >
      <div className={cn(
        "relative max-w-3xl mx-auto w-full rounded-2xl",
        "backdrop-blur-lg bg-white/90 dark:bg-background/90",
        "shadow-[0_8px_32px_rgba(0,0,0,0.1)]",
        "border border-white/20 dark:border-slate-700/30",
        "transform transition-all duration-300"
      )}>
        <ColoredModeIndicator mode={mode} className="absolute top-0 inset-x-0 w-full rounded-t-2xl h-[2px]" />
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
