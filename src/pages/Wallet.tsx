import { useEffect, useState } from "react";
import { UserHeader } from "@/components/layout/UserHeader";
import { PasskeySection } from "@/components/PasskeySection";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Wallet, QrCode } from "lucide-react";
import { AddressQRCode } from "@/components/AddressQRCode";
import { AlgoBalance } from "@/components/AlgoBalance";
import { ConnectedAppsList } from "@/components/ConnectedAppsList";
import { AuthenticationResult, authenticateWithPasskey, registerPasskey } from "@/lib/webauthn";
import { getStoredAlgorandKey } from "@/lib/storage/keyStorage";

export default function WalletPage() {
  const [authResult, setAuthResult] = useState<AuthenticationResult | null>(null);
  const storedAddress = getStoredAlgorandKey();

  const handleRegister = async () => {
    try {
      console.log("Starting passkey registration...");
      const result = await registerPasskey();
      // Convert registration result to authentication result format
      setAuthResult({
        address: result.address,
        publicKey: result.publicKey,
        privateKey: new Uint8Array(32), // Placeholder, will be set during authentication
        addr: result.address,
        sk: new Uint8Array(32) // Placeholder, will be set during authentication
      });
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleAuthenticate = async () => {
    try {
      console.log("Starting passkey authentication...");
      const result = await authenticateWithPasskey();
      setAuthResult(result);
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-artence-navy dark:to-gray-900 transition-colors duration-300">
      <UserHeader />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Wallet className="h-6 w-6 text-artence-purple" />
          <h1 className="text-2xl font-semibold dark:text-white">Wallet</h1>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <PasskeySection
              authResult={authResult}
              onRegister={handleRegister}
              onAuthenticate={handleAuthenticate}
            />
          </Card>

          {(authResult?.address || storedAddress) && (
            <>
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <QrCode className="h-5 w-5 text-artence-purple" />
                  <h2 className="text-lg font-medium dark:text-white">Wallet Details</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <AddressQRCode address={authResult?.address || storedAddress || ''} />
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Balance
                      </label>
                      <AlgoBalance address={authResult?.address || storedAddress || ''} />
                    </div>
                    <Separator />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Connected Applications
                      </label>
                      <ConnectedAppsList />
                    </div>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}