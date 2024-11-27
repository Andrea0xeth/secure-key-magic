import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { connectWithWalletConnect } from "@/lib/walletConnect/connection";
import { setTransactionCallback } from "@/lib/walletConnect/transactionHandler";
import { TransactionSigningDialog } from "@/components/TransactionSigningDialog";
import { ConnectedAppsList } from "@/components/ConnectedAppsList";
import { authenticateWithPasskey, registerPasskey } from "@/lib/webauthn";
import * as algosdk from "algosdk";

const Index = () => {
  const [wcUri, setWcUri] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const { toast } = useToast();

  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<algosdk.Transaction | null>(null);
  const [currentRequestEvent, setCurrentRequestEvent] = useState<any>(null);

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        const result = await authenticateWithPasskey();
        if (result) {
          setIsRegistered(true);
          const account = algosdk.mnemonicToSecretKey(algosdk.secretKeyToMnemonic(result.privateKey));
          setAddress(account.addr);
        }
      } catch (error) {
        console.error("Error checking registration:", error);
      }
    };

    checkRegistration();
  }, []);

  useEffect(() => {
    setTransactionCallback((transaction: algosdk.Transaction, requestEvent?: any) => {
      console.log("Transaction callback triggered with transaction:", transaction);
      console.log("Request event in callback:", requestEvent);
      setCurrentTransaction(transaction);
      setCurrentRequestEvent(requestEvent);
      setIsTransactionDialogOpen(true);
    });
  }, []);

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      const result = await registerPasskey();
      if (result) {
        setIsRegistered(true);
        const account = algosdk.mnemonicToSecretKey(algosdk.secretKeyToMnemonic(result.privateKey));
        setAddress(account.addr);
        toast({
          title: "Registration Successful",
          description: "Your passkey has been registered successfully",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "Failed to register passkey",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!address) {
      toast({
        title: "Error",
        description: "Please register or authenticate first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await connectWithWalletConnect(wcUri, address);
      setWcUri("");
      toast({
        title: "Connection Successful",
        description: "Successfully connected to dApp",
      });
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to dApp",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransactionSign = (signedTxn: Uint8Array) => {
    console.log("Transaction signed successfully");
    setCurrentTransaction(null);
    setCurrentRequestEvent(null);
    setIsTransactionDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Algorand Passkey Wallet</CardTitle>
          <CardDescription>Secure your Algorand wallet with passkeys</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isRegistered ? (
            <Button onClick={handleRegister} disabled={isLoading}>
              {isLoading ? "Registering..." : "Register Passkey"}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-sm font-medium">Your Algorand Address:</p>
                <p className="text-xs font-mono break-all">{address}</p>
              </div>
              
              <div className="space-y-2">
                <Input
                  placeholder="Enter WalletConnect URI"
                  value={wcUri}
                  onChange={(e) => setWcUri(e.target.value)}
                />
                <Button 
                  onClick={handleConnect} 
                  disabled={isLoading || !wcUri}
                  className="w-full"
                >
                  {isLoading ? "Connecting..." : "Connect to dApp"}
                </Button>
              </div>

              <ConnectedAppsList />
            </div>
          )}
        </CardContent>
      </Card>

      <TransactionSigningDialog
        isOpen={isTransactionDialogOpen}
        onClose={() => setIsTransactionDialogOpen(false)}
        transaction={currentTransaction}
        requestEvent={currentRequestEvent}
        onSign={handleTransactionSign}
      />
    </div>
  );
};

export default Index;