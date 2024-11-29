import { useState } from "react";
import { Card } from "@/components/ui/card";
import { authenticateWithPasskey, registerPasskey, AuthenticationResult } from "@/lib/webauthn";
import { connectWithWalletConnect } from "@/lib/walletConnect/connection";
import { ConnectedAppsList } from "@/components/ConnectedAppsList";
import { AlgoBalance } from "@/components/AlgoBalance";
import { AddressQRCode } from "@/components/AddressQRCode";
import { toast } from "@/hooks/use-toast";
import { TransactionSigningDialog } from "@/components/TransactionSigningDialog";
import * as algosdk from "algosdk";
import { setTransactionCallback } from "@/lib/walletConnect/transactionHandler";
import { AuthenticationSection } from "@/components/auth/AuthenticationSection";
import { WalletConnectSection } from "@/components/wallet/WalletConnectSection";
import { Header } from "@/components/layout/Header";

const Index = () => {
  const [authResult, setAuthResult] = useState<AuthenticationResult | null>(null);
  const [currentTransaction, setCurrentTransaction] = useState<algosdk.Transaction | null>(null);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);

  const handleAuthenticate = async () => {
    console.log("Starting passkey authentication...");
    const result = await authenticateWithPasskey();
    if (result) {
      console.log("Passkey authentication successful:", result);
      setAuthResult(result);
      
      setTransactionCallback((transaction: algosdk.Transaction) => {
        console.log("Received transaction to sign:", transaction);
        setCurrentTransaction(transaction);
        setIsTransactionDialogOpen(true);
      });
    }
  };

  const handleRegister = async () => {
    try {
      console.log("Starting passkey registration...");
      const result = await registerPasskey();
      if (result) {
        console.log("Passkey registration successful:", result);
        setAuthResult({
          ...result,
          privateKey: new Uint8Array(32),
        });
        toast({
          title: "Registration Successful",
          description: "Your passkey has been registered successfully.",
        });
      }
    } catch (error) {
      console.error("Error during passkey registration:", error);
      toast({
        title: "Registration Failed",
        description: "Failed to register passkey. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleWalletConnect = async (wcUrl: string) => {
    if (!wcUrl || !authResult?.address) return;
    try {
      await connectWithWalletConnect(wcUrl, authResult.address);
      toast({
        title: "Connection Successful",
        description: "Successfully connected to WalletConnect",
      });
    } catch (error) {
      console.error("Error connecting:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to WalletConnect",
        variant: "destructive",
      });
    }
  };

  const handleSignedTransaction = (signedTxn: Uint8Array) => {
    console.log("Transaction signed:", signedTxn);
    toast({
      title: "Transaction Signed",
      description: "The transaction has been signed successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-artence-navy dark:to-gray-900 transition-colors duration-300">
      <div className="container max-w-2xl px-4 sm:px-6 pt-16 pb-8 animate-fade-in">
        <Header />

        <Card className="p-4 sm:p-6 shadow-lg border-2 border-opacity-50 backdrop-blur-sm bg-white/90 dark:bg-artence-navy/90 dark:border-gray-700 transition-colors duration-300">
          <AuthenticationSection 
            authResult={authResult}
            onRegister={handleRegister}
            onAuthenticate={handleAuthenticate}
          />

          {authResult && (
            <>
              <div className="flex justify-center mt-6">
                <AlgoBalance address={authResult.address} />
              </div>

              <div className="flex justify-center mt-6">
                <AddressQRCode address={authResult.address} />
              </div>

              <div className="mt-6">
                <WalletConnectSection onConnect={handleWalletConnect} />
                
                <div className="py-4">
                  <ConnectedAppsList />
                </div>
              </div>
            </>
          )}
        </Card>

        <TransactionSigningDialog
          isOpen={isTransactionDialogOpen}
          onClose={() => setIsTransactionDialogOpen(false)}
          transaction={currentTransaction}
          onSign={handleSignedTransaction}
        />
      </div>
    </div>
  );
};

export default Index;