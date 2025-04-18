
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { BotMessageSquare, Palette, Wrench, Vault } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SmartBarMode } from "../../types/smart-bar-types"
import { useSmartBar } from "../../context/SmartBarContext"

interface ModeSelectionModalProps {
  isOpen: boolean
  onClose: () => void
}

const modes: { id: SmartBarMode; label: string; icon: typeof BotMessageSquare }[] = [
  { id: "chat", label: "Chat", icon: BotMessageSquare },
  { id: "visual", label: "Visual", icon: Palette },
  { id: "assist", label: "Assist", icon: Wrench },
  { id: "vault", label: "Vault", icon: Vault },
]

export function ModeSelectionModal({ isOpen, onClose }: ModeSelectionModalProps) {
  const { mode: currentMode, setMode } = useSmartBar()

  const handleModeSelect = (mode: SmartBarMode) => {
    setMode(mode)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "w-80 p-2 border-0",
          "bg-white/95 dark:bg-background/95",
          "backdrop-blur-xl shadow-lg",
          "rounded-2xl",
          "grid grid-cols-2 gap-2",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%]"
        )}
      >
        {modes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleModeSelect(id)}
            className={cn(
              "flex flex-col items-center gap-2",
              "p-4 rounded-xl",
              "transition-all duration-200",
              "hover:bg-white/50 dark:hover:bg-slate-800/50",
              "active:scale-95",
              currentMode === id && [
                "bg-white/30 dark:bg-slate-800/30",
                "ring-2 ring-primary/20"
              ]
            )}
          >
            <Icon 
              className={cn(
                "h-6 w-6",
                currentMode === id ? "text-foreground" : "text-muted-foreground"
              )} 
            />
            <span 
              className={cn(
                "text-sm font-medium",
                currentMode === id ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </span>
          </button>
        ))}
      </DialogContent>
    </Dialog>
  )
}
