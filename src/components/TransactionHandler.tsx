import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { authenticateWithPasskey } from "@/lib/webauthn";
import { useToast } from "@/components/ui/use-toast";
import * as algosdk from "algosdk";
import type { AlgorandTransaction } from "@/lib/walletConnect/types";

interface TransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: AlgorandTransaction | null;
  onSign: (signedTxn: Uint8Array) => void;
}

export const TransactionHandler = () => {
  const [transaction, setTransaction] = useState<AlgorandTransaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const client = getSignClient();
    if (!client) {
      console.log("No SignClient available");
      return;
    }

    console.log("Setting up transaction handler");
    const handleRequest = async (event: any) => {
      console.log("Received request event:", event);
      
      const { params } = event;
      if (params.request.method === "algo_signTxn") {
        console.log("Received sign transaction request");
        
        try {
          const txnParams = params.request.params[0][0];
          console.log("Transaction params:", txnParams);
          
          const txn = algosdk.decodeUnsignedTransaction(Buffer.from(txnParams.txn, 'base64'));
          console.log("Decoded transaction:", txn);
          
          if (txn) {
            const transaction: AlgorandTransaction = {
              type: txn.type as TransactionType | 'pay',
              from: { publicKey: txn.from.publicKey },
              to: { publicKey: txn.to.publicKey },
              amount: BigInt(txn.amount),
              fee: txn.fee,
              firstRound: txn.firstRound,
              lastRound: txn.lastRound,
              note: txn.note,
              genesisID: txn.genesisID,
              genesisHash: txn.genesisHash,
              group: txn.group,
              signTxn: (privateKey: Uint8Array) => txn.signTxn(privateKey)
            };
            
            setTransaction(transaction);
            setIsDialogOpen(true);
          }
        } catch (error) {
          console.error("Error processing transaction:", error);
          toast({
            title: "Error",
            description: "Failed to process transaction",
            variant: "destructive",
          });
        }
      }
    };

    client.on("session_request", handleRequest);

    return () => {
      client.off("session_request", handleRequest);
    };
  }, [toast]);

  const handleSign = async (signedTxn: Uint8Array) => {
    console.log("Transaction signed:", signedTxn);
    setIsDialogOpen(false);
    setTransaction(null);
  };

  return (
    <TransactionDialog
      isOpen={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
      transaction={transaction}
      onSign={handleSign}
    />
  );
};