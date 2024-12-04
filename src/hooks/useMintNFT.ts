import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createSoulboundNFT } from "@/lib/algorand/soulboundNFT";
import { supabase } from "@/integrations/supabase/client";
import { getStoredAlgorandKey } from "@/lib/storage/keyStorage";
import { format } from "date-fns";
import { authenticateWithPasskey } from "@/lib/webauthn";

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

      // Get passkey authentication to get the private key
      console.log("Authenticating with passkey...");
      const authResult = await authenticateWithPasskey();
      if (!authResult) {
        throw new Error("Failed to authenticate with passkey");
      }
      console.log("Passkey authentication successful");

      const walletAddress = getStoredAlgorandKey();
      if (!walletAddress) {
        throw new Error("Please authenticate with your passkey first");
      }

      // Create the creator account object with address and private key
      const creator = {
        addr: walletAddress,
        sk: authResult.sk // Use the private key from passkey authentication
      };

      console.log("Creating NFT with authenticated account...");
      const assetId = await createSoulboundNFT(
        creator,
        event.title,
        formattedDate,
        event.image_url
      );

      console.log("NFT created with asset ID:", assetId);

      // Update the event with the NFT asset ID
      const { error: updateError } = await supabase
        .from('events')
        .update({ nft_asset_id: assetId.toString() })
        .eq('id', event.id);

      if (updateError) {
        console.error("Error updating event with NFT asset ID:", updateError);
        throw updateError;
      }

      // Store the NFT in user_nfts table
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

      console.log("NFT successfully saved to database");
      toast({
        title: "Success",
        description: "NFT minted successfully!",
      });
      
      onSuccess();
      
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to mint NFT",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsMinting(false);
    }
  };

  return { mintNFT, isMinting };
};