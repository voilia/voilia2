
import * as React from "react"
import { cn } from "@/lib/utils"

export const SidebarGroupContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-group"
    className={cn("space-y-4", className)}
    {...props}
  />
))
SidebarGroupContainer.displayName = "SidebarGroupContainer"

export const SidebarGroupHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-group-header"
    className={cn("flex items-center justify-between px-4", className)}
    {...props}
  />
))
SidebarGroupHeader.displayName = "SidebarGroupHeader"

export const SidebarGroupTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<"h4">
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    data-sidebar="menu-group-title"
    className={cn("text-sm font-medium", className)}
    {...props}
  />
))
SidebarGroupTitle.displayName = "SidebarGroupTitle"
