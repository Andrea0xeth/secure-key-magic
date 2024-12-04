import { FC } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useMintNFT } from "@/hooks/useMintNFT";
import { EventMintContent } from "./EventMintContent";
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
      title: "Success!",
      description: "NFT minted successfully! You can view all your NFTs in your collection.",
      action: (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            onClose();
            navigate('/my-nfts');
          }}
          className="bg-white hover:bg-gray-100 text-artence-purple border-artence-purple"
        >
          View My NFTs
        </Button>
      ),
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
        action: error.message === "Please authenticate with your passkey first" ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setExpanded(true)}
            className="bg-white hover:bg-gray-100 text-red-600 border-red-200"
          >
            Open Wallet
          </Button>
        ) : undefined,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-artence-navy border-artence-purple sm:rounded-lg w-full sm:w-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Mint Event NFT
          </DialogTitle>
        </DialogHeader>
        <EventMintContent 
          event={event}
          isMinting={isMinting}
          onMint={handleMint}
          onNavigateToNFTs={() => navigate('/my-nfts')}
        />
      </DialogContent>
    </Dialog>
  );
};