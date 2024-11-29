import { AuthenticationResult } from "@/lib/types/auth";
import { PasskeySection } from "../PasskeySection";
import { Shield } from "lucide-react";
import { Card } from "../ui/card";

interface AuthenticationSectionProps {
  authResult: AuthenticationResult | null;
  onRegister: () => Promise<void>;
  onAuthenticate: () => Promise<void>;
}

export const AuthenticationSection = ({ 
  authResult, 
  onRegister, 
  onAuthenticate 
}: AuthenticationSectionProps) => {
  if (!authResult) {
    return (
      <PasskeySection 
        authResult={authResult}
        onRegister={onRegister}
        onAuthenticate={onAuthenticate}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center">
          <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-artence-purple" />
        </div>
        <h2 className="text-xl font-semibold mb-2 dark:text-white transition-colors duration-300">Connected</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
          Your Algorand address:
        </p>
        <code className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs sm:text-sm break-all block text-gray-800 dark:text-gray-200 transition-colors duration-300">
          {authResult.address}
        </code>
      </div>
    </div>
  );
};