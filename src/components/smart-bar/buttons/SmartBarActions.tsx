
import { MessageSquare, User, Paperclip, Mic } from "lucide-react";
import { SmartBarButton } from "../SmartBarButton";

export function SmartBarActions() {
  return (
    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
      <SmartBarButton icon={MessageSquare} tooltip="Chat Mode" />
      <SmartBarButton icon={User} tooltip="Select Agent" />
      <SmartBarButton icon={Paperclip} tooltip="Upload File" />
    </div>
  );
}
