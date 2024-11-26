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
  transaction: algosdk.Transaction | null;
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
        console.error("Failed to authenticate with passkey");
        toast({
          title: "Authentication Failed",
          description: "Failed to authenticate with passkey",
          variant: "destructive",
        });
        return;
      }

      console.log("Successfully authenticated, signing transaction");
      const signedTxn = algosdk.signTransaction(transaction, authResult.privateKey);
      onSign(signedTxn.blob);
      
      toast({
        title: "Transaction Signed",
        description: "Successfully signed the transaction",
      });
      
      onClose();
    } catch (error) {
      console.error("Error signing transaction:", error);
      toast({
        title: "Signing Failed",
        description: "Failed to sign the transaction",
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

  const txnDetails = {
    type: "Payment",
    fee: formatAlgoAmount(transaction.fee),
    from: algosdk.encodeAddress(transaction.from),
    to: algosdk.encodeAddress(transaction.to),
    amount: formatAlgoAmount(transaction.amount)
  };

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
              <span className="text-muted-foreground">Type:</span>
              <span className="col-span-2 font-medium">{txnDetails.type}</span>
              
              <span className="text-muted-foreground">Fee:</span>
              <span className="col-span-2 font-medium">{txnDetails.fee} ALGO</span>
              
              <span className="text-muted-foreground">From:</span>
              <span className="col-span-2 font-medium break-all">{txnDetails.from}</span>
              
              <span className="text-muted-foreground">To:</span>
              <span className="col-span-2 font-medium break-all">{txnDetails.to}</span>
              
              <span className="text-muted-foreground">Amount:</span>
              <span className="col-span-2 font-medium">{txnDetails.amount} ALGO</span>
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