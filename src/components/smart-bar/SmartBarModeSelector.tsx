
import { BotMessageSquare } from "lucide-react"
import { SmartBarButton } from "./SmartBarButton"
import { useSmartBarColors } from "./hooks/useSmartBarColors"
import { useSmartBar } from "./context/SmartBarContext"
import { useState } from "react"
import { ModeSelectionModal } from "./buttons/mode-selector/ModeSelectionModal"
import { cn } from "@/lib/utils"

interface SmartBarModeSelectorProps {
  className?: string;
}

export function SmartBarModeSelector({ className }: SmartBarModeSelectorProps) {
  const { mode } = useSmartBar()
  const { getColors } = useSmartBarColors()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const colorValue = getColors(mode)

  return (
    <>
      <SmartBarButton 
        icon={BotMessageSquare}
        tooltip="Select Mode"
        className={cn(
          "text-foreground",
          "shadow-[0_2px_5px_rgba(0,0,0,0.05)]",
          "hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)]",
          className
        )}
        onClick={() => setIsModalOpen(true)}
        customColor={colorValue}
      />
      
      <ModeSelectionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
