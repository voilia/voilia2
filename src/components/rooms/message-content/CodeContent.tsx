
import React, { useState } from "react";
import { CodeBlock } from "@/types/message-content";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clipboard, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CodeContentProps {
  content: CodeBlock;
  className?: string;
}

export function CodeContent({ content, className }: CodeContentProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative rounded-md overflow-hidden", className)}>
      {content.title && (
        <div className="bg-muted/70 text-xs px-4 py-1 border-b border-border/50">
          {content.title}
        </div>
      )}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={copyToClipboard}
        >
          {copied ? <Check size={16} /> : <Clipboard size={16} />}
        </Button>
        <ScrollArea className="max-h-[500px]">
          <pre className="p-4 text-sm overflow-x-auto">
            <code>{content.code}</code>
          </pre>
        </ScrollArea>
      </div>
    </div>
  );
}
