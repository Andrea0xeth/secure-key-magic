import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export const CloseButton = () => {
  const { setExpanded } = useSidebar();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setExpanded(false)}
      className="absolute right-4 top-4 z-[9999]"
    >
      <X className="h-5 w-5" />
    </Button>
  );
};