import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { authenticateWithPasskey } from "@/lib/webauthn";
import { useToast } from "@/components/ui/use-toast";
import * as algosdk from "algosdk";
import { Card } from "@/components/ui/card";
import { decodeSignedTransaction, decodeUnsignedTransaction } from 'algosdk'

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
        console.error("Failed to authenticate with passkey");
        toast({
          title: "Authentication Failed",
          description: "Failed to authenticate with passkey",
          variant: "destructive",
        });
        return;
      }

      console.log("Successfully authenticated, signing transaction");
      
      try {
        const txnBuffer = Buffer.from(transaction.txn, 'base64');
        const decodedTxn = algosdk.decodeUnsignedTransaction(txnBuffer);
        
        let privateKeyUint8 = new Uint8Array(authResult.privateKey);
        if (privateKeyUint8.length !== 32) {
          const tempKey = new Uint8Array(32);
          tempKey.set(privateKeyUint8.slice(0, 32));
          privateKeyUint8 = tempKey;
        }

        console.log("Private key length:", privateKeyUint8.length);
        
        const signedTxn = algosdk.signTransaction(decodedTxn, privateKeyUint8);
        
        onSign(signedTxn.blob);
        
        toast({
          title: "Transaction Signed",
          description: "Successfully signed the transaction",
        });
        
        onClose();
      } catch (error) {
        console.error("Error decoding/signing transaction:", error);
        toast({
          title: "Signing Failed",
          description: "Failed to process the transaction. Error: " + error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in authentication:", error);
      toast({
        title: "Authentication Failed",
        description: "Failed to authenticate with passkey",
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

    const txnObj = txn.get_obj_for_encoding();
    
    switch (txn.type) {
      case algosdk.TransactionType.pay:
        return {
          ...baseDetails,
          from: txn.from.toString(),
          to: txn.to.toString(),
          amount: formatAlgoAmount(txnObj.amt || 0)
        };
      case algosdk.TransactionType.axfer:
        return {
          ...baseDetails,
          from: txn.from.toString(),
          to: txn.to.toString(),
          assetIndex: txnObj.xaid,
          amount: txnObj.aamt?.toString() || '0'
        };
      case algosdk.TransactionType.acfg:
        return {
          ...baseDetails,
          from: txn.from.toString(),
          assetIndex: txnObj.caid,
          assetParams: {
            total: txnObj.apar?.t,
            decimals: txnObj.apar?.dc,
            name: txnObj.apar?.an,
            unitName: txnObj.apar?.un,
            url: txnObj.apar?.au
          }
        };
      case algosdk.TransactionType.afrz:
        return {
          ...baseDetails,
          from: txn.from.toString(),
          assetIndex: txnObj.faid,
          freezeAccount: txnObj.fadd,
          freezeState: txnObj.afrz
        };
      case algosdk.TransactionType.appl:
        return {
          ...baseDetails,
          from: txn.from.toString(),
          applicationId: txnObj.apid,
          appArgs: txnObj.apaa?.length || 0,
          accounts: txnObj.apat?.length || 0,
          foreignApps: txnObj.apfa?.length || 0,
          foreignAssets: txnObj.apas?.length || 0
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