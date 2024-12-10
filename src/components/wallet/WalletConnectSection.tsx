import { Button } from "@/components/ui/button";
import { Shield, Clipboard } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface WalletConnectSectionProps {
  onConnect: (url: string) => Promise<void>;
}

export const WalletConnectSection = ({ onConnect }: WalletConnectSectionProps) => {
  const [wcUrl, setWcUrl] = useState<string>("");

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      console.log("Pasted text:", text);
      setWcUrl(text);
      toast({
        title: "Text pasted",
        description: "Clipboard content has been pasted",
      });
    } catch (error) {
      console.error("Failed to paste:", error);
      toast({
        title: "Paste failed",
        description: "Unable to access clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Enter WalletConnect URL"
            value={wcUrl}
            onChange={(e) => setWcUrl(e.target.value)}
            className="flex-1 px-3 py-2 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-artence-purple text-sm bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-300"
          />
          <Button
            onClick={handlePaste}
            variant="outline"
            size="icon"
            className="flex-shrink-0"
          >
            <Clipboard className="h-4 w-4" />
          </Button>
        </div>
        <Button
          onClick={() => onConnect(wcUrl)}
          className="w-full sm:w-auto bg-artence-purple hover:bg-primary text-white transition-colors duration-300"
        >
          <Shield className="mr-2 h-4 w-4" />
          Connect
        </Button>
      </div>
    </div>
  );
};