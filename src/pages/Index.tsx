import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { registerPasskey, authenticateWithPasskey, type AuthenticationResult, connectToPeraWallet, disconnectPeraWallet } from "@/lib/webauthn";
import { Shield, Wallet, Link } from "lucide-react";
import { PasskeySection } from "@/components/PasskeySection";
import { DappSection } from "@/components/DappSection";

const Index = () => {
  const [authResult, setAuthResult] = useState<AuthenticationResult | null>(null);
  const [peraAddress, setPeraAddress] = useState<string | null>(null);
  const [dappUrl, setDappUrl] = useState<string>("");
  const { toast } = useToast();

  const handleRegister = async () => {
    const result = await registerPasskey();
    if (result) {
      setAuthResult(result);
      toast({
        title: "Registration Successful",
        description: "Your passkey has been registered successfully!",
      });
    }
  };

  const handleAuthenticate = async () => {
    const result = await authenticateWithPasskey();
    if (result) {
      setAuthResult(result);
      toast({
        title: "Authentication Successful",
        description: "You've been authenticated successfully!",
      });
    }
  };

  const handlePeraConnect = async () => {
    const accounts = await connectToPeraWallet();
    if (accounts.length > 0) {
      setPeraAddress(accounts[0]);
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to Pera Wallet!",
      });
    }
  };

  const handlePeraDisconnect = async () => {
    await disconnectPeraWallet();
    setPeraAddress(null);
    toast({
      title: "Wallet Disconnected",
      description: "Disconnected from Pera Wallet",
    });
  };

  const handleDappConnect = async () => {
    if (!dappUrl) {
      toast({
        title: "Error",
        description: "Please enter a dApp URL",
        variant: "destructive",
      });
      return;
    }

    if (!peraAddress) {
      toast({
        title: "Error",
        description: "Please connect your Pera Wallet first",
        variant: "destructive",
      });
      return;
    }

    console.log("Connecting to dApp:", dappUrl);
    toast({
      title: "DApp Connection",
      description: `Attempting to connect to ${dappUrl}`,
    });
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
          {!peraAddress && (
            <Button
              onClick={handlePeraConnect}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect Pera Wallet
            </Button>
          )}
        </div>

        <Card className="p-6 shadow-lg border-2 border-opacity-50 backdrop-blur-sm">
          {!authResult ? (
            <PasskeySection
              authResult={authResult}
              onRegister={handleRegister}
              onAuthenticate={handleAuthenticate}
            />
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="flex justify-center">
                  <Wallet className="h-12 w-12 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Connected</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your Algorand address:
                  </p>
                  <code className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm break-all block">
                    {authResult.address}
                  </code>
                </div>
                <div className="mt-6">
                  {peraAddress ? (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Pera Wallet connected:
                      </p>
                      <code className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm break-all block">
                        {peraAddress}
                      </code>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter dApp URL"
                            value={dappUrl}
                            onChange={(e) => setDappUrl(e.target.value)}
                            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <Button
                            onClick={handleDappConnect}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            <Link className="mr-2 h-4 w-4" />
                            Connect
                          </Button>
                        </div>
                        <Button
                          onClick={handlePeraDisconnect}
                          variant="outline"
                          className="w-full"
                        >
                          Disconnect Pera Wallet
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={handlePeraConnect}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      Connect Pera Wallet
                    </Button>
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setAuthResult(null)}
                  className="w-full mt-4"
                >
                  Disconnect Passkey
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Index;