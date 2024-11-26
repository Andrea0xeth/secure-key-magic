import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { registerPasskey, authenticateWithPasskey, processWalletConnectUrl, exportPrivateKey, disconnectWalletConnect, type AuthenticationResult } from "@/lib/webauthn";
import { Shield, Link, Download, LogOut } from "lucide-react";
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
      toast({
        title: "Error",
        description: "Please enter a WalletConnect URL",
        variant: "destructive",
      });
      return;
    }

    if (!authResult?.address) {
      toast({
        title: "Error",
        description: "Please authenticate first",
        variant: "destructive",
      });
      return;
    }

    console.log("Processing WalletConnect URL:", wcUrl);
    console.log("Using authenticated address:", authResult.address);

    try {
      const success = await processWalletConnectUrl(wcUrl, authResult.address);
      if (success) {
        setWcUrl("");
      }
    } catch (error) {
      console.error("Error processing WalletConnect URL:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to dApp. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportKey = async () => {
    try {
      const privateKey = await exportPrivateKey();
      
      if (privateKey) {
        const blob = new Blob([privateKey], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'algorand-private-key.txt';
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: "Success",
          description: "Private key exported successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export private key",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      const success = await disconnectWalletConnect();
      if (success) {
        toast({
          title: "Disconnected",
          description: "Successfully disconnected from WalletConnect",
        });
      }
    } catch (error) {
      console.error("Error disconnecting:", error);
      toast({
        title: "Error",
        description: "Failed to disconnect from WalletConnect",
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
                    onClick={handleDisconnect}
                    variant="destructive"
                    className="w-full"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Disconnect WalletConnect
                  </Button>
                  <Button
                    onClick={handleExportKey}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Private Key
                  </Button>
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
