
import { useEffect, useState } from "react";
import { useSmartBar } from "../context/SmartBarContext";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import { X, File, FileImage, FileAudio, FileVideo, FileText } from "lucide-react";
import { formatFileSize } from "@/lib/utils";

export function FileUploadPopover() {
  const { uploadedFiles, removeFile, clearFiles } = useSmartBar();
  const [popoverWidth, setPopoverWidth] = useState<number | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const showPopover = uploadedFiles.length > 0;

  useEffect(() => {
    const updateSmartBarDimensions = () => {
      if (typeof window === 'undefined') return;
      
      const smartBarForm = document.querySelector('form.rounded-2xl');
      if (smartBarForm) {
        const rect = smartBarForm.getBoundingClientRect();
        
        setPopoverWidth(rect.width);
        setPopoverPosition({
          top: rect.top - 12,
          left: rect.left
        });
      }
    };
    
    if (showPopover) {
      updateSmartBarDimensions();
      window.addEventListener('resize', updateSmartBarDimensions);
      window.addEventListener('scroll', updateSmartBarDimensions);
      
      return () => {
        window.removeEventListener('resize', updateSmartBarDimensions);
        window.removeEventListener('scroll', updateSmartBarDimensions);
      };
    }
  }, [showPopover]);

  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return FileImage;
    if (fileType.startsWith('audio/')) return FileAudio;
    if (fileType.startsWith('video/')) return FileVideo;
    if (fileType.startsWith('text/') || fileType.includes('document')) return FileText;
    return File;
  };

  if (!showPopover || typeof document === 'undefined') return null;
  
  return createPortal(
    <div 
      className={cn(
        "file-upload-popover fixed z-50 overflow-hidden",
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
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-foreground">
          {uploadedFiles.length} {uploadedFiles.length === 1 ? 'file' : 'files'} attached
        </h3>
        <button 
          onClick={clearFiles}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear all
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[30vh] overflow-y-auto pr-1">
        {uploadedFiles.map((file) => {
          const FileIcon = getFileIcon(file.type);
          
          return (
            <div 
              key={file.id} 
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg",
                "border border-border/50 group relative",
                isDark ? "bg-black/20" : "bg-white/20"
              )}
            >
              {file.preview ? (
                <div className="w-8 h-8 rounded overflow-hidden border border-border/30 flex-shrink-0">
                  <img 
                    src={file.preview} 
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0">
                  <FileIcon className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" title={file.name}>{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              
              <button
                onClick={() => removeFile(file.id)}
                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-muted transition-colors ml-1"
              >
                <X className="w-4 h-4" />
                <span className="sr-only">Remove file</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>,
    document.body
  );
}
