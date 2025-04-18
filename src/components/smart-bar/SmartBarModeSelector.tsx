
import { BotMessageSquare } from "lucide-react"
import { useSmartBarColors } from "./hooks/useSmartBarColors"
import { useSmartBar } from "./context/SmartBarContext"
import { cn } from "@/lib/utils"
import { ModeSelectorPopover } from "./buttons/mode-selector/ModeSelectorPopover"
import { useState } from "react"

interface SmartBarModeSelectorProps {
  className?: string;
  disabled?: boolean;
}

export function SmartBarModeSelector({ className, disabled }: SmartBarModeSelectorProps) {
  const { mode } = useSmartBar()
  const { getColors } = useSmartBarColors()
  const colorValue = getColors(mode)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ModeSelectorPopover 
      open={isOpen} 
      onOpenChange={setIsOpen} 
      disabled={disabled}
    >
      <button 
        className={cn(
          "flex items-center justify-center h-8 w-8 rounded-lg",
          "bg-transparent",
          "shadow-sm",
          "transition-all duration-200 active:scale-95",
          "hover:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05)]",
          "hover:bg-white/30 dark:hover:bg-slate-800/50",
          disabled ? "opacity-50 cursor-not-allowed hover:bg-transparent active:scale-100" : "",
          className
        )}
        style={{ color: colorValue }}
        type="button" 
        aria-label="Select Mode"
      >
        <BotMessageSquare className="h-5 w-5" />
        <span className="sr-only">Select Mode</span>
      </button>
    </ModeSelectorPopover>
  )
}
