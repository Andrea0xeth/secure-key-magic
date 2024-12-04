import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasskeySection } from "../PasskeySection";
import { UserProfileSection } from "../UserProfileSection";
import { AuthenticationResult } from "@/lib/webauthn";

interface WalletContentProps {
  authResult: AuthenticationResult | null;
  onRegister: () => Promise<void>;
  onAuthenticate: () => Promise<void>;
  onLogout: () => Promise<void>;
}

export const WalletContent = ({
  authResult,
  onRegister,
  onAuthenticate,
  onLogout,
}: WalletContentProps) => {
  return (
    <Tabs defaultValue="wallet" className="w-full mt-16">
      <div className="border-b">
        <TabsList className="w-full justify-between bg-transparent border-b p-0">
          <TabsTrigger 
            value="wallet"
            className="flex-1 py-3 px-4 transition-all duration-200 data-[state=active]:bg-artence-light dark:data-[state=active]:bg-artence-navy data-[state=active]:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Wallet className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger 
            value="settings"
            className="flex-1 py-3 px-4 transition-all duration-200 data-[state=active]:bg-artence-light dark:data-[state=active]:bg-artence-navy data-[state=active]:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Settings className="h-5 w-5" />
          </TabsTrigger>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="flex-1 py-3 px-4 h-auto rounded-none hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-destructive transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </TabsList>
      </div>

      <TabsContent value="wallet" className="p-6 mt-0">
        <div className="mb-8 space-y-4">
          <h2 className="text-2xl font-semibold text-artence-navy dark:text-white">
            Your Digital Wallet
          </h2>
          {!authResult && (
            <>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Create a secure and easy-to-use wallet with passkeys - the modern way to manage your digital assets.
              </p>
              <div className="bg-artence-light dark:bg-artence-navy/50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  ✨ With passkeys, you can:
                </p>
                <ul className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Access your wallet securely across all your devices</li>
                  <li>• Sign transactions with just your fingerprint or Face ID</li>
                  <li>• Never worry about losing or forgetting complex passwords</li>
                </ul>
              </div>
            </>
          )}
        </div>
        <PasskeySection
          authResult={authResult}
          onRegister={onRegister}
          onAuthenticate={onAuthenticate}
        />
      </TabsContent>

      <TabsContent value="settings" className="p-6 mt-0">
        <UserProfileSection />
      </TabsContent>
    </Tabs>
  );
};