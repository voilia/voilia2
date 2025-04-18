
import { BotMessageSquare } from "lucide-react"
import { useSmartBarColors } from "./hooks/useSmartBarColors"
import { useSmartBar } from "./context/SmartBarContext"
import { cn } from "@/lib/utils"
import { ModeSelectorPopover } from "./buttons/mode-selector/ModeSelectorPopover"

interface SmartBarModeSelectorProps {
  className?: string;
  disabled?: boolean;
}

export function SmartBarModeSelector({ className, disabled }: SmartBarModeSelectorProps) {
  const { mode } = useSmartBar()
  const { getColors } = useSmartBarColors()
  const colorValue = getColors(mode)

  return (
    <ModeSelectorPopover disabled={disabled}>
      <button 
        className={cn(
          "flex items-center justify-center h-8 w-8 rounded-md transition-colors",
          "hover:bg-accent/80 focus:outline-none",
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
