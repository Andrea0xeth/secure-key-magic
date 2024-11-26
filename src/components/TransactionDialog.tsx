import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { authenticateWithPasskey } from "@/lib/webauthn";
import { useToast } from "@/components/ui/use-toast";
import * as algosdk from "algosdk";
import { Card } from "@/components/ui/card";

interface TransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
    txn: string;  // base64 encoded transaction
    type?: string;
  } | null;
  onSign: (signedTxn: Uint8Array) => void;
}

export const TransactionDialog = ({ isOpen, onClose, transaction, onSign }: TransactionDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSign = async () => {
    if (!transaction) {
      console.error("No transaction to sign");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Starting transaction signing process");
      
      const authResult = await authenticateWithPasskey();
      if (!authResult) {
        throw new Error("Failed to authenticate with passkey");
      }

      console.log("Successfully authenticated, signing transaction");
      
      try {
        // Decode the transaction
        const txnBuffer = Buffer.from(transaction.txn, 'base64');
        const decodedTxn = algosdk.decodeUnsignedTransaction(txnBuffer);
        
        // Create the account using the private key
        const account = algosdk.mnemonicToSecretKey(algosdk.secretKeyToMnemonic(authResult.privateKey));
        console.log("Created account for signing with address:", account.addr);
        
        // Sign the transaction using algosdk's signTransaction
        const signedTxn = algosdk.signTransaction(decodedTxn, account.sk);
        console.log("Transaction signed successfully");
        
        onSign(signedTxn.blob);
        
        toast({
          title: "Transaction Signed",
          description: "Successfully signed the transaction",
        });
        
        onClose();
      } catch (error) {
        console.error("Error signing transaction:", error);
        throw new Error(`Failed to sign transaction: ${error.message}`);
      }
    } catch (error) {
      console.error("Error in transaction process:", error);
      toast({
        title: "Transaction Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatAlgoAmount = (amount: number | bigint): string => {
    const numericAmount = typeof amount === 'bigint' ? Number(amount) : amount;
    return (numericAmount / 1_000_000).toFixed(6);
  };

  if (!transaction) return null;

  let txnDetails;
  try {
    const txnBuffer = Buffer.from(transaction.txn, 'base64');
    const decodedTxn = algosdk.decodeUnsignedTransaction(txnBuffer);
    const txnObj = decodedTxn.get_obj_for_encoding();
    
    console.log("Decoded transaction:", txnObj);

    txnDetails = {
      type: txnObj.type || 'Unknown',
      fee: formatAlgoAmount(txnObj.fee || 0),
      from: algosdk.encodeAddress(txnObj.snd),
      to: txnObj.rcv ? algosdk.encodeAddress(txnObj.rcv) : 'N/A',
      amount: txnObj.amt ? formatAlgoAmount(txnObj.amt) : '0'
    };

    console.log("Transaction details:", txnDetails);
  } catch (error) {
    console.error("Error decoding transaction:", error);
    txnDetails = {
      type: transaction.type || 'Unknown',
      fee: '0',
      from: 'Error decoding',
      to: 'Error decoding',
      amount: '0'
    };
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign Transaction</DialogTitle>
          <DialogDescription>
            Review and sign the transaction with your passkey
          </DialogDescription>
        </DialogHeader>
        
        <Card className="p-4 space-y-3">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Transaction Details</h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              {Object.entries(txnDetails).map(([key, value]) => (
                <div key={key} className="contents">
                  <span className="text-muted-foreground capitalize">{key}:</span>
                  <span className="col-span-2 font-medium break-all">
                    {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
                  </span>
              </div>
              ))}
            </div>
          </div>
        </Card>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSign} 
            disabled={isLoading}
            className="bg-artence-purple hover:bg-artence-purple/90"
          >
            {isLoading ? "Signing..." : "Sign with Passkey"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
