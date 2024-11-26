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

  const getTransactionDetails = (txn: algosdk.Transaction) => {
    const baseDetails = {
      type: txn.type,
      fee: formatAlgoAmount(txn.fee),
    };

    switch (txn.type) {
      case algosdk.TransactionType.pay:
        return {
          ...baseDetails,
          from: algosdk.encodeAddress(txn.from.publicKey),
          to: algosdk.encodeAddress(txn.to.publicKey),
          amount: formatAlgoAmount(txn.amount)
        };
      case algosdk.TransactionType.axfer:
        return {
          ...baseDetails,
          from: algosdk.encodeAddress(txn.from.publicKey),
          to: algosdk.encodeAddress(txn.to.publicKey),
          assetIndex: txn.assetIndex,
          amount: txn.amount.toString()
        };
      case algosdk.TransactionType.acfg:
        return {
          ...baseDetails,
          from: algosdk.encodeAddress(txn.from.publicKey),
          assetIndex: txn.assetIndex,
          assetParams: {
            total: txn.assetTotal,
            decimals: txn.assetDecimals,
            name: txn.assetName,
            unitName: txn.assetUnitName,
            url: txn.assetURL
          }
        };
      case algosdk.TransactionType.afrz:
        return {
          ...baseDetails,
          from: algosdk.encodeAddress(txn.from.publicKey),
          assetIndex: txn.assetIndex,
          freezeAccount: txn.freezeAccount,
          freezeState: txn.freezeState
        };
      case algosdk.TransactionType.appl:
        return {
          ...baseDetails,
          from: algosdk.encodeAddress(txn.from.publicKey),
          applicationId: txn.appIndex,
          appArgs: txn.appArgs?.length || 0,
          accounts: txn.appAccounts?.length || 0,
          foreignApps: txn.appForeignApps?.length || 0,
          foreignAssets: txn.appForeignAssets?.length || 0
        };
      default:
        return baseDetails;
    }
  };

  const txnDetails = getTransactionDetails(transaction);

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
                <React.Fragment key={key}>
                  <span className="text-muted-foreground capitalize">{key}:</span>
                  <span className="col-span-2 font-medium break-all">
                    {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
                  </span>
                </React.Fragment>
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