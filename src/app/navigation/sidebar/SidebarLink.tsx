
import * as React from "react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Slot } from "@radix-ui/react-slot"

interface SidebarLinkProps extends React.ComponentProps<"button"> {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | React.ComponentProps<typeof TooltipContent>
  isMobile?: boolean
  state?: "expanded" | "collapsed"
}

export const SidebarLink = React.forwardRef<HTMLButtonElement, SidebarLinkProps>(
  ({ asChild = false, isActive = false, tooltip, isMobile, state, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-active={isActive}
        className={cn(
          "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-sm",
          "outline-none ring-sidebar-ring transition-[width,height,padding]",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2",
          "active:bg-sidebar-accent active:text-sidebar-accent-foreground",
          "disabled:pointer-events-none disabled:opacity-50",
          "aria-disabled:pointer-events-none aria-disabled:opacity-50",
          "data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground",
          "[&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
          className
        )}
        {...props}
      />
    )

    if (!tooltip) {
      return button
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...(typeof tooltip === "string" ? { children: tooltip } : tooltip)}
        />
      </Tooltip>
    )
  }
)
SidebarLink.displayName = "SidebarLink"
