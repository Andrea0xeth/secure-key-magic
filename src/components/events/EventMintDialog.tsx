import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Event } from "@/lib/types/event";
import { EventMintContent } from "./EventMintContent";

interface EventMintDialogProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isMinting: boolean;
  onMint: () => Promise<void>;
  onNavigateToNFTs: () => void;
}

export function EventMintDialog({
  event,
  open,
  onOpenChange,
  isMinting,
  onMint,
  onNavigateToNFTs
}: EventMintDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <EventMintContent 
          event={event} 
          isMinting={isMinting} 
          onMint={onMint}
          onNavigateToNFTs={onNavigateToNFTs}
        />
      </DialogContent>
    </Dialog>
  );
}