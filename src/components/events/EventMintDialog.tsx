import { FC, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventShareButtons } from "./EventShareButtons";
import { useToast } from "@/components/ui/use-toast";
import { createSoulboundNFT } from "@/lib/algorand/soulboundNFT";
import { supabase } from "@/integrations/supabase/client";
import { getStoredAlgorandKey } from "@/lib/storage/keyStorage";
import { useSidebar } from "@/components/ui/sidebar";
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
  const [isMinting, setIsMinting] = useState(false);
  const { toast } = useToast();
  const { setExpanded } = useSidebar();
  const formattedDate = format(new Date(event.date), "MMM d, yyyy");

  const handleMint = async () => {
    try {
      setIsMinting(true);
      console.log("Starting NFT minting process for event:", event.title);

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Get the stored wallet address
      const walletAddress = getStoredAlgorandKey();
      if (!walletAddress) {
        toast({
          title: "Wallet Not Found",
          description: "Please authenticate with your passkey first",
          variant: "destructive",
          action: (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setExpanded(true)}
              className="bg-white hover:bg-gray-100 text-red-600 border-red-200"
            >
              Open Wallet
            </Button>
          ),
        });
        return;
      }

      // Create the account object (the private key will be provided through passkey authentication)
      const account = {
        addr: walletAddress,
        sk: new Uint8Array(32) // This will be replaced with the actual key during signing
      };

      // Create the soulbound NFT - this will handle passkey authentication and signing
      const assetId = await createSoulboundNFT(
        account,
        event.title,
        formattedDate,
        event.image_url
      );

      // Update the events table with the NFT asset ID
      const { error: updateError } = await supabase
        .from('events')
        .update({ nft_asset_id: assetId.toString() })
        .eq('id', event.id);

      if (updateError) throw updateError;

      // Save the NFT to user_nfts table
      const { error: insertError } = await supabase
        .from('user_nfts')
        .insert({
          user_id: user.id,
          event_id: event.id,
          asset_id: assetId.toString()
        });

      if (insertError) throw insertError;

      toast({
        title: "Success!",
        description: "NFT minted successfully",
      });

      onClose();
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast({
        title: "Minting Failed",
        description: error.message || "Failed to mint NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
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
        <div className="grid gap-6 py-4">
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{event.title}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <CalendarIcon className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <MapPinIcon className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              {event.description}
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-center">
              <EventShareButtons event={event} />
            </div>
            <Button 
              className="w-full bg-artence-purple hover:bg-white hover:text-artence-purple border-2 border-transparent hover:border-artence-purple transition-all duration-300"
              onClick={handleMint}
              disabled={isMinting}
            >
              {isMinting ? "Minting..." : "Confirm Mint"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};