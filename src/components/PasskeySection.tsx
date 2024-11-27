import { useState } from "react";
import { Button } from "@/components/ui/button";
import { KeyRound, Shield } from "lucide-react";
import { AuthenticationResult } from "@/lib/webauthn";
import { useToast } from "@/components/ui/use-toast";
import { decodeUnsignedTransaction } from 'algosdk'
import { TransactionDialog } from "./TransactionDialog";
import * as algosdk from "algosdk";

interface PasskeySectionProps {
  authResult: AuthenticationResult | null;
  onRegister: () => Promise<void>;
  onAuthenticate: () => Promise<void>;
}

export const PasskeySection = ({ authResult, onRegister, onAuthenticate }: PasskeySectionProps) => {
  const [currentTransaction, setCurrentTransaction] = useState<{
    txn: string;
    type?: string;
  } | null>(null);
  const { toast } = useToast();

  if (authResult) return null;
  
  const handleAuthenticate = async () => {
    try {
      console.log("Starting passkey authentication...");
      await onAuthenticate();
    } catch (error) {
      console.error("Error during passkey authentication:", error);
      toast({
        title: "Authentication Failed",
        description: "Failed to authenticate with passkey. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async () => {
    try {
      console.log("Starting passkey registration...");
      await onRegister();
    } catch (error) {
      console.error("Error during passkey registration:", error);
      toast({
        title: "Registration Failed",
        description: "Failed to register passkey. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleWalletConnectTransaction = async (txnRequest: any) => {
    try {
      if (!txnRequest.txn) {
        throw new Error('Transaction data is missing');
      }

      setCurrentTransaction({
        txn: txnRequest.txn,
        type: txnRequest.type
      });
      
    } catch (error) {
      console.error('Error processing transaction:', error);
      toast({
        title: "Transaction Error",
        description: "Failed to process the transaction request",
        variant: "destructive",
      });
    }
  };

  const handleSignTransaction = async (signedTxn: Uint8Array) => {
    try {
      console.log("Transaction signed:", signedTxn);
      setCurrentTransaction(null);
    } catch (error) {
      console.error("Error handling signed transaction:", error);
      toast({
        title: "Transaction Error",
        description: "Failed to process the signed transaction",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <Button
            onClick={handleRegister}
            className="w-full bg-artence-purple hover:bg-artence-purple/90 text-white transition-colors duration-300"
          >
            <KeyRound className="mr-2 h-4 w-4" />
            Register New Passkey
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full border-artence-purple text-artence-purple hover:bg-artence-purple/10 transition-colors duration-300"
            onClick={handleAuthenticate}
          >
            <Shield className="mr-2 h-4 w-4" />
            Authenticate with Passkey
          </Button>
        </div>
      </div>
      
      <TransactionDialog
        isOpen={!!currentTransaction}
        onClose={() => setCurrentTransaction(null)}
        transaction={currentTransaction}
        onSign={handleSignTransaction}
      />
    </>
  );
};