import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { registerPasskey, authenticateWithPasskey, type AuthenticationResult } from "@/lib/webauthn";
import { Shield, Link } from "lucide-react";
import { PasskeySection } from "@/components/PasskeySection";

const Index = () => {
  const [authResult, setAuthResult] = useState<AuthenticationResult | null>(null);
  const [wcUrl, setWcUrl] = useState<string>("");
  const { toast } = useToast();

  const handleRegister = async () => {
    console.log("Starting passkey registration...");
    const result = await registerPasskey();
    if (result) {
      console.log("Passkey registration successful:", result);
      setAuthResult(result);
      toast({
        title: "Registration Successful",
        description: "Your passkey has been registered successfully!",
      });
    }
  };

  const handleAuthenticate = async () => {
    console.log("Starting passkey authentication...");
    const result = await authenticateWithPasskey();
    if (result) {
      console.log("Passkey authentication successful:", result);
      setAuthResult(result);
      toast({
        title: "Authentication Successful",
        description: "You've been authenticated successfully!",
      });
    }
  };

  const handleWalletConnectUrl = async () => {
    if (!wcUrl) {
      console.log("Error: No WalletConnect URL provided");
      toast({
        title: "Error",
        description: "Please enter a WalletConnect URL",
        variant: "destructive",
      });
      return;
    }

    if (!authResult) {
      console.log("Error: No authentication result found");
      toast({
        title: "Error",
        description: "Please authenticate with your passkey first",
        variant: "destructive",
      });
      return;
    }

    console.log("Processing WalletConnect URL:", wcUrl);
    console.log("Using authenticated address:", authResult.address);
    
    try {
      // Here we'll parse and validate the WalletConnect URL
      const isValidWcUrl = wcUrl.startsWith('wc:');
      if (!isValidWcUrl) {
        console.error("Invalid WalletConnect URL format");
        toast({
          title: "Error",
          description: "Invalid WalletConnect URL format. Must start with 'wc:'",
          variant: "destructive",
        });
        return;
      }

      console.log("WalletConnect URL is valid, attempting connection...");
      toast({
        title: "WalletConnect",
        description: "Processing connection request...",
      });
    } catch (error) {
      console.error("WalletConnect error:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to process WalletConnect URL",
        variant: "destructive",
      });
    }
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
            <PasskeySection
              authResult={authResult}
              onRegister={handleRegister}
              onAuthenticate={handleAuthenticate}
            />
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="flex justify-center">
                  <Shield className="h-12 w-12 text-green-500" />
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
                <div className="mt-6 space-y-4">
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
                  <Button
                    variant="outline"
                    onClick={() => setAuthResult(null)}
                    className="w-full"
                  >
                    Disconnect Passkey
                  </Button>
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