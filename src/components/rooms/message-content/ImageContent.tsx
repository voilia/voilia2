
import React, { useState } from "react";
import { ImageBlock } from "@/types/message-content";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ImageContentProps {
  content: ImageBlock;
  className?: string;
}

export function ImageContent({ content, className }: ImageContentProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Default aspect ratio if not provided
  const aspectRatio = content.aspectRatio || 16 / 9;
  
  return (
    <div className={cn("overflow-hidden rounded-md max-w-full", className)}>
      <Dialog>
        <DialogTrigger asChild>
          <div className="cursor-pointer">
            <AspectRatio ratio={aspectRatio} className="bg-muted">
              <div className={cn(
                "absolute inset-0 flex items-center justify-center",
                isLoaded ? "opacity-0" : "opacity-100"
              )}>
                <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              </div>
              <img
                src={content.url}
                alt={content.alt || "Image"}
                className={cn(
                  "h-full w-full object-cover transition-opacity duration-300",
                  isLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setIsLoaded(true)}
              />
            </AspectRatio>
            {content.caption && (
              <div className="text-xs text-muted-foreground mt-1 px-1">
                {content.caption}
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden">
          <img
            src={content.url}
            alt={content.alt || "Image"}
            className="max-w-full max-h-[90vh] object-contain"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
