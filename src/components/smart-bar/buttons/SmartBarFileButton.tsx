
import { Paperclip } from "lucide-react";
import { SmartBarButton } from "../SmartBarButton";
import { useRef } from "react";
import { useSmartBar } from "../context/SmartBarContext";
import { toast } from "sonner";

interface SmartBarFileButtonProps {
  className?: string;
  disabled?: boolean;
}

export function SmartBarFileButton({ className, disabled }: SmartBarFileButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addFiles, uploadedFiles } = useSmartBar();
  
  const handleClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      console.info(`Selected ${files.length} files in file button`);
      
      if (files.length > 10) {
        toast.warning("Maximum 10 files can be uploaded at once.");
        addFiles(files.slice(0, 10));
      } else {
        addFiles(files);
        console.info(`Added ${files.length} files, total now: ${uploadedFiles.length + files.length}`);
      }
      
      // Reset the input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  return (
    <>
      <SmartBarButton 
        icon={Paperclip}
        tooltip="Upload File" 
        className={className}
        onClick={handleClick}
        disabled={disabled}
      />
      <input 
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        onChange={handleFileChange}
        accept="image/*,video/*,audio/*,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        disabled={disabled}
      />
    </>
  );
}
