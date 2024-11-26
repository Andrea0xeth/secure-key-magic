import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Link } from "lucide-react";
import { authenticateWithPasskey } from "@/lib/webauthn";
import { connectWithWalletConnect } from "@/lib/walletConnect/connection";
import { ConnectedAppsList } from "@/components/ConnectedAppsList";
import { AlgoBalance } from "@/components/AlgoBalance";
import { AddressQRCode } from "@/components/AddressQRCode";
import { SeedPhraseInput } from "@/components/SeedPhraseInput";

const Index = () => {
  const [authResult, setAuthResult] = useState<{ address: string } | null>(null);
  const [wcUrl, setWcUrl] = useState<string>("");
  const [showSeedInput, setShowSeedInput] = useState(false);

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

  const handleSeedPhraseSuccess = (address: string) => {
    setAuthResult({ address });
    setShowSeedInput(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container max-w-2xl pt-16 pb-8 animate-fade-in">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Shield className="h-16 w-16 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-400">
            Algorand Passkeys
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Secure Algorand authentication using passkeys
          </p>
        </div>

        <Card className="p-6 shadow-lg border-2 border-opacity-50 backdrop-blur-sm">
          {!authResult ? (
            <div className="space-y-4">
              <div className="text-center">
                <Button
                  onClick={handleAuthenticate}
                  className="bg-blue-500 hover:bg-blue-600 text-white mb-4"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Authenticate with Passkey
                </Button>
                
                <div className="relative my-4">
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
                  onClick={() => setShowSeedInput(true)}
                  variant="outline"
                  className="w-full"
                >
                  Recover with Seed Phrase
                </Button>
              </div>

              {showSeedInput && (
                <SeedPhraseInput onSuccess={handleSeedPhraseSuccess} />
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="flex justify-center">
                  <Shield className="h-12 w-12 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Connected</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Your Algorand address:
                </p>
                <code className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm break-all block">
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
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter WalletConnect URL"
                    value={wcUrl}
                    onChange={(e) => setWcUrl(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    onClick={handleWalletConnectUrl}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Link className="mr-2 h-4 w-4" />
                    Connect
                  </Button>
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