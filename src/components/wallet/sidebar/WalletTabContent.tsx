import { Wallet } from "lucide-react";
import { PasskeySection } from "../../PasskeySection";
import { AuthenticationResult } from "@/lib/webauthn";
import { TabsContent } from "@/components/ui/tabs";

interface WalletTabContentProps {
  authResult: AuthenticationResult | null;
  onRegister: () => Promise<void>;
  onAuthenticate: () => Promise<void>;
}

export const WalletTabContent = ({ authResult, onRegister, onAuthenticate }: WalletTabContentProps) => {
  return (
    <TabsContent value="wallet" className="p-6 mt-0">
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold text-artence-navy dark:text-white">
          Your Digital Wallet
        </h2>
        {!authResult && (
          <>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Create a secure and easy-to-use wallet with passkeys - the modern way to manage your digital assets. Passkeys use your device's biometric security (like Face ID or fingerprint) to keep your wallet safe without the need for complex passwords.
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
  );
};