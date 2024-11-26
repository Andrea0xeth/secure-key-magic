import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { authenticateWithPasskey } from "@/lib/webauthn";
import { connectWithWalletConnect } from "@/lib/walletConnect/connection";
import { ConnectedAppsList } from "@/components/ConnectedAppsList";
import { AlgoBalance } from "@/components/AlgoBalance";
import { AddressQRCode } from "@/components/AddressQRCode";
import { QRScanner } from "@/components/QRScanner";

const Index = () => {
  const [authResult, setAuthResult] = useState<{ address: string } | null>(null);
  const [wcUrl, setWcUrl] = useState<string>("");

  const handleAuthenticate = async () => {
    console.log("Starting passkey authentication...");
    const result = await authenticateWithPasskey();
    if (result) {
      console.log("Passkey authentication successful:", result);
      setAuthResult(result);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-artence-light to-white dark:from-artence-dark dark:to-gray-800">
      <div className="container max-w-2xl px-4 sm:px-6 pt-16 pb-8 animate-fade-in">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img 
              src="https://www.artence.net/assets/artence-logo-white.svg" 
              alt="Artence Logo" 
              className="h-12 w-auto dark:block hidden"
            />
            <img 
              src="https://www.artence.net/assets/artence-logo-black.svg" 
              alt="Artence Logo" 
              className="h-12 w-auto dark:hidden"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-artence-purple to-primary">
            Artence Passkey
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6">
            Secure Algorand authentication using passkeys
          </p>
        </div>

        <Card className="p-4 sm:p-6 shadow-lg border-2 border-opacity-50 backdrop-blur-sm">
          {!authResult ? (
            <div className="text-center">
              <Button
                onClick={handleAuthenticate}
                className="w-full sm:w-auto bg-artence-purple hover:bg-primary text-white"
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
                <h2 className="text-xl font-semibold mb-2">Connected</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Your Algorand address:
                </p>
                <code className="px-3 py-2 sm:px-4 sm:py-2 bg-artence-light dark:bg-artence-dark rounded-lg text-xs sm:text-sm break-all block">
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
                  <input
                    type="text"
                    placeholder="Enter WalletConnect URL"
                    value={wcUrl}
                    onChange={(e) => setWcUrl(e.target.value)}
                    className="flex-1 px-3 py-2 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-artence-purple text-sm"
                  />
                  <div className="flex gap-2">
                    <QRScanner onResult={setWcUrl} />
                    <Button
                      onClick={handleWalletConnectUrl}
                      className="w-full sm:w-auto bg-artence-purple hover:bg-primary text-white"
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
      </div>
    </div>
  );
};

export default Index;