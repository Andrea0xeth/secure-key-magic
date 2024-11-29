import * as React from "react"
import { cn } from "@/lib/utils"

const SidebarContext = React.createContext<{
  expanded: boolean
  setExpanded: (expanded: boolean) => void
} | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export function SidebarProvider({
  children,
  defaultExpanded = true,
}: {
  children: React.ReactNode
  defaultExpanded?: boolean
}) {
  const [expanded, setExpanded] = React.useState(defaultExpanded)
  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function Sidebar({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const { expanded } = useSidebar()
  return (
    <aside
      className={cn(
        "h-screen transition-all duration-300",
        "bg-gradient-radial from-artence-light via-white to-transparent dark:from-artence-navy dark:via-artence-dark/90 dark:to-artence-dark/50",
        expanded ? "md:w-[500px] w-full" : "w-0 overflow-hidden",
        className
      )}
    >
      <div className="h-full overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 sm:px-6 h-full">
          {children}
        </div>
      </div>
    </aside>
  )
}

export function SidebarHeader({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("p-4 flex items-center justify-between", className)}>
      {children}
    </div>
  )
}

export function SidebarContent({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("h-full overflow-y-auto", className)}>
      {children}
    </div>
  )
}