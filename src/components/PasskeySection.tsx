import { useState } from "react";
import { Button } from "@/components/ui/button";
import { KeyRound, Shield } from "lucide-react";
import { AuthenticationResult } from "@/lib/webauthn";
import { useToast } from "@/components/ui/use-toast";
import { decodeUnsignedTransaction } from 'algosdk'
import { TransactionDialog } from "./TransactionDialog";
import * as algosdk from "algosdk";
import { getStoredAlgorandKey } from "@/lib/storage/keyStorage";

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

  // Only check stored key if we have an auth result
  const storedKey = authResult ? getStoredAlgorandKey() : null;
  
  if (authResult && storedKey) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex justify-center">
            <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-artence-purple" />
          </div>
          <h2 className="text-xl font-semibold mb-2 dark:text-white transition-colors duration-300">
            Connected
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
            Your Algorand address:
          </p>
          <code className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs sm:text-sm break-all block text-gray-800 dark:text-gray-200 transition-colors duration-300">
            {storedKey}
          </code>
        </div>
      </div>
    );
  }
  
  const handleAuthenticate = async () => {
    try {
      console.log("Starting passkey authentication...");
      await onAuthenticate();
      toast({
        title: "Authentication Successful",
        description: "Successfully authenticated with passkey",
      });
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
      toast({
        title: "Registration Successful",
        description: "Successfully registered new passkey",
      });
    } catch (error) {
      console.error("Error during passkey registration:", error);
      toast({
        title: "Registration Failed",
        description: "Failed to register passkey. Please try again.",
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
        onSign={async (signedTxn) => {
          console.log("Transaction signed:", signedTxn);
          setCurrentTransaction(null);
          toast({
            title: "Transaction Signed",
            description: "Successfully signed the transaction",
          });
        }}
      />
    </>
  );
};