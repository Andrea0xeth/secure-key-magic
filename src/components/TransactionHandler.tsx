import { useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { TransactionDialog } from '@/components/TransactionDialog';
import { useState } from 'react';
import { getSignClient } from '@/lib/walletConnect/client';
import * as algosdk from 'algosdk';
import { AlgorandTransaction } from '@/lib/walletConnect/types';

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
          
          const decodedTxn = algosdk.decodeObj(Buffer.from(txnParams.txn, 'base64')) as algosdk.TransactionParams;
          console.log("Decoded transaction:", decodedTxn);
          
          if (decodedTxn) {
            const transaction = {
              type: decodedTxn.type || 'pay',
              from: { publicKey: decodedTxn.snd || new Uint8Array() },
              to: { publicKey: decodedTxn.rcv || new Uint8Array() },
              amount: BigInt(decodedTxn.amt || 0),
              fee: decodedTxn.fee || 0,
              firstRound: decodedTxn.fv || 0,
              lastRound: decodedTxn.lv || 0,
              note: decodedTxn.note,
              genesisID: decodedTxn.gen || '',
              genesisHash: decodedTxn.gh || '',
              group: decodedTxn.grp,
              signTxn: (privateKey: Uint8Array) => {
                const txn = new algosdk.Transaction(decodedTxn);
                return txn.signTxn(privateKey);
              }
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