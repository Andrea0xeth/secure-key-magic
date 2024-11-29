"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SidebarContextType {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

const SidebarContext = React.createContext<SidebarContextType>({
  expanded: false,
  setExpanded: () => {},
});

export function useSidebar() {
  return React.useContext(SidebarContext);
}

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function SidebarProvider({
  children,
  defaultExpanded = false,
}: SidebarProviderProps) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </SidebarContext.Provider>
  );
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, children, ...props }: SidebarProps) {
  const { expanded } = useSidebar();

  return (
    <aside
      className={cn(
        "fixed top-0 right-0 h-screen transition-all duration-500 ease-in-out z-[90]",
        "bg-gradient-radial from-artence-light via-white to-transparent dark:from-black dark:via-artence-dark/90 dark:to-artence-dark/50",
        // Desktop styles
        "md:w-[500px]",
        // Mobile styles
        "w-full",
        expanded ? "translate-x-0" : "translate-x-full",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
}