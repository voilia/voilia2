
import { useSmartBar } from "../context/SmartBarContext";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import { FilePopoverHeader } from "./components/FilePopoverHeader";
import { FilePreviewList } from "./components/FilePreviewList";
import { useFilePopoverPosition } from "./hooks/useFilePopoverPosition";
import { useEffect } from "react";

export function FileUploadPopover() {
  const { uploadedFiles, removeFile, clearFiles } = useSmartBar();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const showPopover = uploadedFiles.length > 0;
  const { popoverWidth, popoverPosition } = useFilePopoverPosition(showPopover);

  // Debug log to help identify issues
  useEffect(() => {
    if (showPopover) {
      console.info(`FileUploadPopover should show with ${uploadedFiles.length} files at position:`, popoverPosition);
    }
  }, [showPopover, uploadedFiles.length, popoverPosition]);

  // Don't render anything until we have files and document is available
  if (!showPopover || typeof document === 'undefined') return null;
  
  return createPortal(
    <div 
      className={cn(
        "file-upload-popover fixed z-[999]",
        "shadow-lg transition-all duration-200 rounded-xl p-3",
        isDark 
          ? "bg-black/60 border-white/10" 
          : "bg-white/70 border-foreground/10",
        "backdrop-blur-lg border"
      )}
      style={{
        width: popoverWidth ? `${popoverWidth}px` : 'auto',
        top: `${popoverPosition.top - 16}px`,
        left: `${popoverPosition.left}px`,
        transform: 'translateY(-100%)',
        maxHeight: 'calc(90vh - 200px)',
        overflowY: 'auto'
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
