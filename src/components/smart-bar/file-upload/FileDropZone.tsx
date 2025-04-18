
import { useEffect, useRef } from "react";
import { useSmartBar } from "../context/SmartBarContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Paperclip } from "lucide-react";

interface FileDropZoneProps {
  children: React.ReactNode;
}

export function FileDropZone({ children }: FileDropZoneProps) {
  const { isDraggingOver, setIsDraggingOver, addFiles } = useSmartBar();
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(true);
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDraggingOver) setIsDraggingOver(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Only set to false if we're leaving the drop zone
      if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
        setIsDraggingOver(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);

      if (e.dataTransfer?.files?.length) {
        const files = Array.from(e.dataTransfer.files);
        console.info(`Dropped ${files.length} files`);
        addFiles(files);
        // Notify for debugging
        if (files.length) {
          toast.success(`Added ${files.length} files`, {
            duration: 2000
          });
        }
      }
    };

    const dropZoneElement = dropZoneRef.current;
    if (dropZoneElement) {
      dropZoneElement.addEventListener("dragenter", handleDragEnter);
      dropZoneElement.addEventListener("dragover", handleDragOver);
      dropZoneElement.addEventListener("dragleave", handleDragLeave);
      dropZoneElement.addEventListener("drop", handleDrop);

      return () => {
        dropZoneElement.removeEventListener("dragenter", handleDragEnter);
        dropZoneElement.removeEventListener("dragover", handleDragOver);
        dropZoneElement.removeEventListener("dragleave", handleDragLeave);
        dropZoneElement.removeEventListener("drop", handleDrop);
      };
    }
  }, [isDraggingOver, setIsDraggingOver, addFiles]);

  return (
    <div 
      ref={dropZoneRef} 
      className={cn(
        "relative h-full w-full transition-all duration-300",
        isDraggingOver && "after:absolute after:inset-0 after:bg-primary/10 after:backdrop-blur-sm after:border-2 after:border-dashed after:border-primary/30 after:rounded-lg after:z-10"
      )}
    >
      {children}
      
      {isDraggingOver && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-background/80 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-primary/20 animate-fade-in">
            <div className="flex flex-col items-center gap-3">
              <Paperclip className="h-10 w-10 text-primary/80" />
              <p className="text-xl font-medium text-center">Drop files to upload</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
