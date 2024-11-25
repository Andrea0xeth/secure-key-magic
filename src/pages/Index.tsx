import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { registerPasskey, authenticateWithPasskey, type AuthenticationResult } from "@/lib/webauthn";
import { KeyRound, Shield, Wallet } from "lucide-react";

const Index = () => {
  const [authResult, setAuthResult] = useState<AuthenticationResult | null>(null);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container max-w-2xl pt-16 pb-8 animate-fade-in">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Shield className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            ETH Passkeys
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Secure Ethereum authentication using passkeys
          </p>
        </div>

        <Card className="p-6 shadow-lg border-2 border-opacity-50 backdrop-blur-sm">
          {!authResult ? (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <Button
                  onClick={handleRegister}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
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
                  onClick={handleAuthenticate}
                  variant="outline"
                  className="w-full"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Authenticate with Passkey
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <Wallet className="h-12 w-12 text-success" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Connected</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Your Ethereum address:
                </p>
                <code className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">
                  {authResult.address}
                </code>
              </div>
              <Button
                variant="outline"
                onClick={() => setAuthResult(null)}
                className="w-full"
              >
                Disconnect
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Index;