import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Scan, Clipboard } from "lucide-react";
import { authenticateWithPasskey, registerPasskey } from "@/lib/webauthn";
import { connectWithWalletConnect } from "@/lib/walletConnect/connection";
import { ConnectedAppsList } from "@/components/ConnectedAppsList";
import { AlgoBalance } from "@/components/AlgoBalance";
import { AddressQRCode } from "@/components/AddressQRCode";
import { QRScanner } from "@/components/QRScanner";
import { useTheme } from "next-themes";
import { toast } from "@/hooks/use-toast";
import { TransactionSigningDialog } from "@/components/TransactionSigningDialog";
import * as algosdk from "algosdk";
import { setTransactionCallback } from "@/lib/walletConnect/transactionHandler";

const Index = () => {
  const [authResult, setAuthResult] = useState<{ address: string } | null>(null);
  const [wcUrl, setWcUrl] = useState<string>("");
  const { theme, setTheme } = useTheme();
  const [currentTransaction, setCurrentTransaction] = useState<algosdk.Transaction | null>(null);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);

  const handleAuthenticate = async () => {
    console.log("Starting passkey authentication...");
    const result = await authenticateWithPasskey();
    if (result) {
      console.log("Passkey authentication successful:", result);
      setAuthResult(result);
      
      // Set up transaction handling
      setTransactionCallback((transaction: algosdk.Transaction) => {
        console.log("Received transaction to sign:", transaction);
        setCurrentTransaction(transaction);
        setIsTransactionDialogOpen(true);
      });
    }
  };

  const handleWalletConnectUrl = async () => {
    if (!wcUrl || !authResult?.address) return;
    try {
      await connectWithWalletConnect(wcUrl, authResult.address);
      setWcUrl("");
    } catch (error) {
      console.error("Error connecting:", error);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      console.log("Pasted text:", text);
      setWcUrl(text);
      toast({
        title: "Text pasted",
        description: "Clipboard content has been pasted",
      });
    } catch (error) {
      console.error("Failed to paste:", error);
      toast({
        title: "Paste failed",
        description: "Unable to access clipboard",
        variant: "destructive",
      });
    }
  };

  const handleSignedTransaction = (signedTxn: Uint8Array) => {
    console.log("Transaction signed:", signedTxn);
    // Here you would normally send the signed transaction back to the dApp
    toast({
      title: "Transaction Signed",
      description: "The transaction has been signed successfully",
    });
  };

  // ... keep existing code (UI rendering)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-artence-navy dark:to-gray-900 transition-colors duration-300">
      <div className="container max-w-2xl px-4 sm:px-6 pt-16 pb-8 animate-fade-in">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img 
              src="/artence-logo-white.svg" 
              alt="Artence Logo" 
              className="h-12 w-auto hidden dark:block"
            />
            <img 
              src="/artence-logo-black.svg" 
              alt="Artence Logo" 
              className="h-12 w-auto dark:hidden"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-artence-purple to-primary dark:from-artence-purple dark:to-primary">
            Artence Passkey
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300">
            Secure Algorand authentication using passkeys
          </p>
        </div>

        <Card className="p-4 sm:p-6 shadow-lg border-2 border-opacity-50 backdrop-blur-sm bg-white/90 dark:bg-artence-navy/90 dark:border-gray-700 transition-colors duration-300">
          {!authResult ? (
            <div className="text-center">
              <Button
                onClick={handleAuthenticate}
                className="w-full sm:w-auto bg-artence-purple hover:bg-primary text-white transition-colors duration-300"
              >
                <Shield className="mr-2 h-4 w-4" />
                Authenticate with Passkey
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="flex justify-center">
                  <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-artence-purple" />
                </div>
                <h2 className="text-xl font-semibold mb-2 dark:text-white transition-colors duration-300">Connected</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
                  Your Algorand address:
                </p>
                <code className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs sm:text-sm break-all block text-gray-800 dark:text-gray-200 transition-colors duration-300">
                  {authResult.address}
                </code>
              </div>

              <div className="flex justify-center">
                <AlgoBalance address={authResult.address} />
              </div>

              <div className="flex justify-center">
                <AddressQRCode address={authResult.address} />
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter WalletConnect URL"
                      value={wcUrl}
                      onChange={(e) => setWcUrl(e.target.value)}
                      className="flex-1 px-3 py-2 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-artence-purple text-sm bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-300"
                    />
                    <Button
                      onClick={handlePaste}
                      variant="outline"
                      size="icon"
                      className="flex-shrink-0"
                    >
                      <Clipboard className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    {/* Temporarily commented out QR Scanner
                    <QRScanner onResult={setWcUrl} />
                    */}
                    <Button
                      onClick={handleWalletConnectUrl}
                      className="w-full sm:w-auto bg-artence-purple hover:bg-primary text-white transition-colors duration-300"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Connect
                    </Button>
                  </div>
                </div>
                
                <div className="py-4">
                  <ConnectedAppsList />
                </div>
              </div>
            </div>
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
