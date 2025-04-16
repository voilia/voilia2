
import { File, FileImage, FileAudio, FileVideo, FileText, X } from "lucide-react";
import { UploadedFile } from "../../types/smart-bar-types";
import { formatFileSize } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

interface FilePreviewItemProps {
  file: UploadedFile;
  onRemove: (fileId: string) => void;
}

export function FilePreviewItem({ file, onRemove }: FilePreviewItemProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return FileImage;
    if (fileType.startsWith('audio/')) return FileAudio;
    if (fileType.startsWith('video/')) return FileVideo;
    if (fileType.startsWith('text/') || fileType.includes('document')) return FileText;
    return File;
  };

  const FileIcon = getFileIcon(file.type);
  
  return (
    <div 
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
        onClick={() => onRemove(file.id)}
        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-muted transition-colors ml-1"
      >
        <X className="w-4 h-4" />
        <span className="sr-only">Remove file</span>
      </button>
    </div>
  );
}
