
import { SmartBarForm } from "./components/SmartBarForm";
import { SmartBarFooter } from "./SmartBarFooter";
import { useSmartBar } from "./context/SmartBarContext";

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
  const { enterSends, setEnterSends } = useSmartBar();
  const isMobile = useIsMobile();

  return (
    <div className="fixed z-20 w-full px-2 md:px-4 pb-2">
      <SmartBarForm
        onSendMessage={onSendMessage}
        isDisabled={isDisabled}
      />
      <SmartBarFooter 
        enterSends={enterSends}
        onToggleEnterSends={() => setEnterSends(!enterSends)}
        className={isMobile ? "bottom-[86px]" : "bottom-0"}
      />
    </div>
  );
}
