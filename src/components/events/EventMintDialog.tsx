import { FC } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useMintNFT } from "@/hooks/useMintNFT";
import { EventMintContent } from "./EventMintContent";
import { EventMintSuccessAction } from "./EventMintSuccessAction";
import { EventMintErrorAction } from "./EventMintErrorAction";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Event {
  id: string;
  title: string;
  description: string;
  image_url: string;
  date: string;
  location: string;
  nft_asset_id?: string;
}

interface EventMintDialogProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

export const EventMintDialog: FC<EventMintDialogProps> = ({
  event,
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const { setExpanded } = useSidebar();
  const navigate = useNavigate();

  const handleSuccess = () => {
    onClose();
    toast({
      title: "NFT Minted Successfully! 🎉",
      description: "Your NFT has been added to your collection. Click below to view all your NFTs.",
      variant: "success",
      action: <EventMintSuccessAction />,
    });
  };

  const { mintNFT, isMinting } = useMintNFT(event, handleSuccess);

  const handleMint = async () => {
    try {
      await mintNFT();
    } catch (error) {
      toast({
        title: "Minting Failed",
        description: error.message === "Please authenticate with your passkey first"
          ? error.message
          : "Failed to mint NFT. Please try again.",
        variant: "destructive",
        action: error.message === "Please authenticate with your passkey first" 
          ? <EventMintErrorAction setExpanded={setExpanded} />
          : undefined,
      });
    }
  };

  const handleNavigateToNFTs = () => {
    navigate('/my-nfts');
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-[425px] bg-white dark:bg-artence-navy border-artence-purple sm:rounded-lg w-full sm:w-auto fixed z-[100]"
        onInteractOutside={(e) => {
          e.preventDefault();
          onClose();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Mint Event NFT
          </DialogTitle>
        </DialogHeader>
        <EventMintContent 
          event={event}
          isMinting={isMinting}
          onMint={handleMint}
          onNavigateToNFTs={handleNavigateToNFTs}
        />
      </DialogContent>
    </Dialog>
  );
};