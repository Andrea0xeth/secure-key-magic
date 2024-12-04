import React from "react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createSoulboundNFT } from "@/lib/algorand/soulboundNFT";
import { supabase } from "@/integrations/supabase/client";
import { getStoredAlgorandKey } from "@/lib/storage/keyStorage";
import { format } from "date-fns";
import { EventMintSuccessAction } from "@/components/events/EventMintSuccessAction";
import { ToastAction } from "@/components/ui/toast";

interface Event {
  id: string;
  title: string;
  date: string;
  image_url: string;
}

export const useMintNFT = (event: Event, onSuccess: () => void) => {
  const [isMinting, setIsMinting] = useState(false);
  const { toast } = useToast();
  const formattedDate = format(new Date(event.date), "MMM d, yyyy");

  const mintNFT = async () => {
    try {
      setIsMinting(true);
      console.log("Starting NFT minting process for event:", event.title);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Check if user already has an NFT for this event
      const { data: existingNFT } = await supabase
        .from('user_nfts')
        .select('*')
        .eq('user_id', user.id)
        .eq('event_id', event.id)
        .single();

      if (existingNFT) {
        toast({
          title: "NFT Already Minted",
          description: "You have already minted an NFT for this event.",
          variant: "destructive",
        });
        return;
      }

      const walletAddress = getStoredAlgorandKey();
      if (!walletAddress) {
        throw new Error("Please authenticate with your passkey first");
      }

      const account = {
        addr: walletAddress,
        sk: new Uint8Array(32)
      };

      const assetId = await createSoulboundNFT(
        account,
        event.title,
        formattedDate,
        event.image_url
      );

      console.log("NFT created with asset ID:", assetId);

      const { error: updateError } = await supabase
        .from('events')
        .update({ nft_asset_id: assetId.toString() })
        .eq('id', event.id);

      if (updateError) throw updateError;

      const { error: insertError } = await supabase
        .from('user_nfts')
        .insert({
          user_id: user.id,
          event_id: event.id,
          asset_id: assetId.toString()
        });

      if (insertError) {
        console.error("Error saving NFT to user_nfts:", insertError);
        throw insertError;
      }

      console.log("NFT saved to user_nfts table");
      onSuccess();
      
      const toastInstance = toast({
        title: "NFT Minted Successfully!",
        description: "Your NFT has been created and added to your collection.",
        variant: "success",
        action: (
          <ToastAction altText="View NFTs" onClick={() => {
            toastInstance.dismiss();
            window.location.href = '/my-nfts';
          }}>
            View My NFTs
          </ToastAction>
        ),
      });
      
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to mint NFT",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  return { mintNFT, isMinting };
};