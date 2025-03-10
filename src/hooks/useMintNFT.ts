import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createSoulboundNFT } from "@/lib/algorand/soulboundNFT";
import { ERC1155Client } from "@/lib/algorand/erc1155";
import { supabase } from "@/integrations/supabase/client";
import { getStoredAlgorandKey } from "@/lib/storage/keyStorage";
import { format } from "date-fns";
import { TokenType } from "@/components/MintingOptions";
import * as algosdk from "algosdk";

interface Event {
  id: string;
  title: string;
  date: string;
  image_url: string;
}

export const useMintNFT = (event: Event, onSuccess: () => void) => {
  const [isMinting, setIsMinting] = useState(false);
  const { toast } = useToast();
  const formattedDate = format(new Date(event.date), "dd/MM/yyyy");

  const mintNFT = async (tokenType: TokenType) => {
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

      let assetId: number;

      if (tokenType === "soulbound") {
        // Mint Soulbound NFT
        assetId = await createSoulboundNFT(
          account,
          event.title,
          formattedDate,
          event.image_url
        );
      } else {
        // Mint ERC-1155 token
        const algodClient = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "");
        const erc1155 = new ERC1155Client(
          algodClient,
          Number(process.env.VITE_ERC1155_APP_ID),
          account
        );

        // Create a new token type if needed
        const tokenId = await erc1155.createToken();
        await erc1155.mint(account.addr, tokenId, 1);
        assetId = tokenId;
      }

      console.log("NFT created with asset ID:", assetId);

      // Update database
      const { error: updateError } = await supabase
        .from('user_nfts')
        .insert({
          user_id: user.id,
          event_id: event.id,
          asset_id: assetId.toString(),
          token_type: tokenType,
          minted_at: new Date().toISOString()
        });

      if (updateError) {
        throw updateError;
      }

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
    } finally {
      setIsMinting(false);
    }
  };

  return {
    mintNFT,
    isMinting,
  };
};