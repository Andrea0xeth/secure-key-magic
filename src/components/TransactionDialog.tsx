import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { authenticateWithPasskey } from "@/lib/webauthn";
import { useToast } from "@/components/ui/use-toast";
import * as algosdk from "algosdk";

interface TransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: algosdk.Transaction;
  onSign: (signedTxn: Uint8Array) => void;
}

export const TransactionDialog = ({ isOpen, onClose, transaction, onSign }: TransactionDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSign = async () => {
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
      const signedTxn = transaction.signTxn(new Uint8Array(32)); // Placeholder for actual signing
      onSign(signedTxn);
      
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

  if (!transaction) return null;

  const formatAlgoAmount = (microAlgos: number | bigint): string => {
    const amount = typeof microAlgos === 'bigint' ? Number(microAlgos) : microAlgos;
    return (amount / 1_000_000).toFixed(6);
  };

  const txType = transaction.type;
  const txFrom = algosdk.encodeAddress(transaction.from.publicKey);
  const txTo = transaction.to ? algosdk.encodeAddress(transaction.to.publicKey) : '';
  const txAmount = transaction.amount || 0;
  const txFee = transaction.fee;
  const txGroup = transaction.group;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign Transaction</DialogTitle>
          <DialogDescription>
            Review and sign the transaction with your passkey
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h4 className="text-sm font-medium mb-2">Transaction Details</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Type: {txType}</p>
              {txGroup && <p>Group ID: {Buffer.from(txGroup).toString('base64')}</p>}
              <p>Fee: {formatAlgoAmount(txFee)} ALGO</p>
              <p>From: {txFrom}</p>
              <p>To: {txTo}</p>
              <p>Amount: {formatAlgoAmount(txAmount)} ALGO</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSign} disabled={isLoading}>
            {isLoading ? "Signing..." : "Sign with Passkey"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};