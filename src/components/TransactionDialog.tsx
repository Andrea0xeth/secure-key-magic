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
      const authResult = await authenticateWithPasskey();
      
      if (!authResult) {
        toast({
          title: "Authentication Failed",
          description: "Failed to authenticate with passkey",
          variant: "destructive",
        });
        return;
      }

      // Here we would sign the transaction with the authenticated key
      // For now, we'll just mock the signing
      const signedTxn = new Uint8Array(transaction.bytesToSign());
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
              <p>Type: {transaction.type}</p>
              <p>Amount: {transaction.amount ? transaction.amount / 1e6 : 0} ALGO</p>
              <p>Fee: {transaction.fee / 1e6} ALGO</p>
              {transaction.to && (
                <p>To: {algosdk.encodeAddress(transaction.to.publicKey)}</p>
              )}
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