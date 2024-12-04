import { FC } from "react";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon, LogIn, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventShareButtons } from "./EventShareButtons";
import { useSidebar } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { getStoredAlgorandKey } from "@/lib/storage/keyStorage";
import { TransactionDialog } from "@/components/TransactionDialog";
import { createSoulboundNFT } from "@/lib/algorand/soulboundNFT";
import { useToast } from "@/components/ui/use-toast";

interface Event {
  id: string;
  title: string;
  description: string;
  image_url: string;
  date: string;
  location: string;
  nft_asset_id?: string;
}

interface EventMintContentProps {
  event: Event;
  isMinting: boolean;
  onMint: () => Promise<void>;
  onNavigateToNFTs: () => void;
}

export const EventMintContent: FC<EventMintContentProps> = ({
  event,
  isMinting,
  onMint,
  onNavigateToNFTs,
}) => {
  const { setExpanded } = useSidebar();
  const [session, setSession] = useState<any>(null);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [transactionToSign, setTransactionToSign] = useState<{ txn: string } | null>(null);
  const { toast } = useToast();
  const formattedDate = format(new Date(event.date), "MMM d, yyyy");
  const walletAddress = getStoredAlgorandKey();

  useEffect(() => {
    console.log("EventMintContent: Initializing");
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("EventMintContent: Initial session loaded:", session);
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("EventMintContent: Auth state changed:", _event, session);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginClick = () => {
    console.log("EventMintContent: Login clicked");
    setExpanded(true);
  };

  const handleConnectWalletClick = () => {
    console.log("EventMintContent: Connect wallet clicked");
    setExpanded(true);
  };

  const handleMintClick = async () => {
    console.log("EventMintContent: Mint clicked");
    try {
      if (!walletAddress) {
        throw new Error("Wallet not connected");
      }

      console.log("EventMintContent: Creating NFT transaction...");
      const account = {
        addr: walletAddress,
        sk: new Uint8Array(32) // This will be replaced with the actual private key from passkey
      };

      // Create the NFT transaction
      const txn = await createSoulboundNFT(
        account,
        event.title,
        formattedDate,
        event.image_url
      );

      // Convert transaction to base64 for signing
      const txnBase64 = Buffer.from(txn.toByte()).toString('base64');
      console.log("EventMintContent: Transaction created:", txnBase64);

      // Open transaction dialog for signing
      setTransactionToSign({ txn: txnBase64 });
      setIsTransactionDialogOpen(true);

    } catch (error) {
      console.error("EventMintContent: Error preparing mint transaction:", error);
      toast({
        title: "Error",
        description: "Failed to prepare minting transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSignedTransaction = async (signedTxn: Uint8Array) => {
    console.log("EventMintContent: Transaction signed, completing mint process");
    try {
      await onMint();
      console.log("EventMintContent: Minting completed successfully");
      toast({
        title: "Success",
        description: "NFT minted successfully!",
      });
      onNavigateToNFTs();
    } catch (error) {
      console.error("EventMintContent: Error during minting:", error);
      toast({
        title: "Error",
        description: "Failed to complete minting process. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderActionButton = () => {
    if (!session) {
      return (
        <Button 
          className="w-full bg-artence-purple hover:bg-white hover:text-artence-purple border-2 border-transparent hover:border-artence-purple transition-all duration-300"
          onClick={handleLoginClick}
        >
          <LogIn className="mr-2 h-4 w-4" />
          Login to Mint NFT
        </Button>
      );
    }

    if (!walletAddress) {
      return (
        <Button 
          className="w-full bg-artence-purple hover:bg-white hover:text-artence-purple border-2 border-transparent hover:border-artence-purple transition-all duration-300"
          onClick={handleConnectWalletClick}
        >
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet to Mint
        </Button>
      );
    }

    return (
      <Button 
        className="w-full bg-artence-purple hover:bg-white hover:text-artence-purple border-2 border-transparent hover:border-artence-purple transition-all duration-300"
        onClick={handleMintClick}
        disabled={isMinting}
      >
        {isMinting ? "Minting..." : "Mint NFT"}
      </Button>
    );
  };

  return (
    <>
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
          {renderActionButton()}
        </div>
      </div>

      <TransactionDialog
        isOpen={isTransactionDialogOpen}
        onClose={() => setIsTransactionDialogOpen(false)}
        transaction={transactionToSign}
        onSign={handleSignedTransaction}
      />
    </>
  );
};