import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { PasskeySection } from "@/components/PasskeySection";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { QrCode, Wallet } from "lucide-react";
import { AddressQRCode } from "@/components/AddressQRCode";
import { AlgoBalance } from "@/components/AlgoBalance";
import { ConnectedAppsList } from "@/components/ConnectedAppsList";
import { AuthenticationResult, authenticateWithPasskey, registerPasskey } from "@/lib/webauthn";
import { getStoredAlgorandKey } from "@/lib/storage/keyStorage";
import { useState } from "react";

export function WalletSidebar() {
  const [authResult, setAuthResult] = useState<AuthenticationResult | null>(null);
  const storedAddress = getStoredAlgorandKey();

  const handleRegister = async () => {
    try {
      console.log("Starting passkey registration...");
      const result = await registerPasskey();
      setAuthResult({
        address: result.address,
        publicKey: result.publicKey,
        privateKey: new Uint8Array(32),
        addr: result.address,
        sk: new Uint8Array(32)
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
    <Sidebar className="border-l border-border">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-artence-purple" />
          <h2 className="text-lg font-semibold">Wallet</h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <div className="space-y-6">
          <Card className="p-4">
            <PasskeySection
              authResult={authResult}
              onRegister={handleRegister}
              onAuthenticate={handleAuthenticate}
            />
          </Card>

          {(authResult?.address || storedAddress) && (
            <Card className="p-4">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <QrCode className="h-5 w-5 text-artence-purple" />
                    <h3 className="text-base font-medium">Wallet Details</h3>
                  </div>
                  <div className="space-y-6">
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
                </div>
              </div>
            </Card>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}