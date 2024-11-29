import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar
} from "@/components/ui/sidebar";
import { PasskeySection } from "@/components/PasskeySection";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Wallet, Settings } from "lucide-react";
import { AddressQRCode } from "@/components/AddressQRCode";
import { AlgoBalance } from "@/components/AlgoBalance";
import { ConnectedAppsList } from "@/components/ConnectedAppsList";
import { AuthenticationResult, authenticateWithPasskey, registerPasskey } from "@/lib/webauthn";
import { getStoredAlgorandKey } from "@/lib/storage/keyStorage";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tab = 'wallet' | 'settings';

export function WalletSidebar() {
  const [authResult, setAuthResult] = useState<AuthenticationResult | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('wallet');
  const storedAddress = getStoredAlgorandKey();
  const { setExpanded } = useSidebar();

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

  const TabButton = ({ tab, icon: Icon, label }: { tab: Tab; icon: any; label: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setActiveTab(tab)}
      className={cn(
        "flex items-center gap-2 px-3 py-2 transition-colors duration-200",
        activeTab === tab ? "text-artence-purple bg-artence-purple/10" : "text-gray-600 hover:text-artence-purple"
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );

  return (
    <Sidebar className="border-l border-border">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TabButton tab="wallet" icon={Wallet} label="Wallet" />
            <TabButton tab="settings" icon={Settings} label="Settings" />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        {activeTab === 'wallet' && (
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
        )}
        
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">User Settings</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Settings section coming soon...
              </p>
            </Card>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}