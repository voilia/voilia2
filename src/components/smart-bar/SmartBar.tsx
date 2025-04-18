
import { SmartBarForm } from "./components/SmartBarForm";
import { SmartBarFooter } from "./SmartBarFooter";
import { useSmartBar } from "./context/SmartBarContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { RoomMessage } from "@/types/room-messages";
import { cn } from "@/lib/utils";
import { ColoredModeIndicator } from "./buttons/mode-selector/ColoredModeIndicator";
import { useTheme } from "@/components/ThemeProvider";

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
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
        "relative max-w-3xl mx-auto w-full",
        "flex flex-col gap-2",
        "SmartBar" // This class name is important for positioning
      )}>
        <div className={cn(
          "relative w-full rounded-xl overflow-hidden",
          isDark 
            ? "bg-black/30 border-white/10" 
            : "bg-foreground/5 border-foreground/10",
          "backdrop-blur-lg border",
          "shadow-lg transition-all duration-300"
        )}>
          <ColoredModeIndicator 
            mode={mode} 
            className="absolute top-0 inset-x-0 w-full rounded-t-xl" 
          />
          <SmartBarForm
            onSendMessage={onSendMessage}
            isDisabled={isDisabled}
          />
        </div>

        <SmartBarFooter 
          enterSends={enterSends}
          onToggleEnterSends={() => setEnterSends(!enterSends)}
          className="max-w-3xl mx-auto"
        />
      </div>
    </div>
  );
}
