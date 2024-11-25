import { Button } from "@/components/ui/button";
import { KeyRound, Shield } from "lucide-react";
import { AuthenticationResult } from "@/lib/webauthn";

interface PasskeySectionProps {
  authResult: AuthenticationResult | null;
  onRegister: () => Promise<void>;
  onAuthenticate: () => Promise<void>;
}

export const PasskeySection = ({ authResult, onRegister, onAuthenticate }: PasskeySectionProps) => {
  if (authResult) return null;
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <Button
          onClick={onRegister}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
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
          onClick={onAuthenticate}
          variant="outline"
          className="w-full"
        >
          <Shield className="mr-2 h-4 w-4" />
          Authenticate with Passkey
        </Button>
      </div>
    </div>
  );
};