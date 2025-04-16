
import { useSmartBar } from "../context/SmartBarContext";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import { FilePopoverHeader } from "./components/FilePopoverHeader";
import { FilePreviewList } from "./components/FilePreviewList";
import { useFilePopoverPosition } from "./hooks/useFilePopoverPosition";

export function FileUploadPopover() {
  const { uploadedFiles, removeFile, clearFiles } = useSmartBar();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const showPopover = uploadedFiles.length > 0;
  const { popoverWidth, popoverPosition } = useFilePopoverPosition(showPopover);

  if (!showPopover || typeof document === 'undefined') return null;
  
  return createPortal(
    <div 
      className={cn(
        "file-upload-popover fixed z-40 overflow-hidden",
        "shadow-lg transition-all duration-200 rounded-2xl p-3",
        isDark 
          ? "bg-black/30 border-white/10" 
          : "bg-foreground/5 border-foreground/10",
        "backdrop-blur-lg border"
      )}
      style={{
        width: popoverWidth ? `${popoverWidth}px` : 'auto',
        top: `${popoverPosition.top}px`,
        left: `${popoverPosition.left}px`,
        transform: 'translateY(-100%)',
      }}
    >
      <FilePopoverHeader 
        fileCount={uploadedFiles.length} 
        onClearAll={clearFiles} 
      />
      
      <FilePreviewList 
        files={uploadedFiles} 
        onRemoveFile={removeFile} 
      />
    </div>,
    document.body
  );
}
