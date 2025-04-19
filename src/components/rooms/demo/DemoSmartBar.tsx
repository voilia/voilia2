
import { SmartBarForm } from "@/components/smart-bar/components/SmartBarForm";
import { SmartBarFooter } from "@/components/smart-bar/SmartBarFooter";
import { useSmartBar } from "@/components/smart-bar/context/SmartBarContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { RoomMessage } from "@/types/room-messages";
import { cn } from "@/lib/utils";
import { ColoredModeIndicator } from "@/components/smart-bar/buttons/mode-selector/ColoredModeIndicator";
import { useTheme } from "@/components/ThemeProvider";
import { FileUploadPopover } from "@/components/smart-bar/file-upload/FileUploadPopover";

interface DemoSmartBarProps {
  onSendMessage: (message: string, files?: File[]) => Promise<void>;
  isDisabled?: boolean;
  addLocalMessage?: (message: RoomMessage) => void;
}

export function DemoSmartBar({ 
  onSendMessage, 
  isDisabled = false,
  addLocalMessage
}: DemoSmartBarProps) {
  const { enterSends, setEnterSends, mode, uploadedFiles } = useSmartBar();
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  console.log("DemoSmartBar rendering with files:", uploadedFiles.length);

  return (
    <div 
      className={cn(
        "fixed bg-transparent",
        "w-full transition-all duration-300 ease-out z-50",
        isMobile ? "bottom-0 px-0 inset-x-0" : "bottom-6 px-4"
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
        isMobile && "px-3 pb-3",
        "DemoSmartBar"
      )}>
        <FileUploadPopover />
        
        <div className={cn(
          "relative w-full rounded-xl overflow-hidden",
          isDark 
            ? "bg-black/60 border-white/10" 
            : "bg-white/70 border-foreground/10",
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
