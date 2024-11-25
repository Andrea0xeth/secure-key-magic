import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface DappSectionProps {
  peraAddress: string | null;
  onDisconnect: () => Promise<void>;
}

export const DappSection = ({ peraAddress, onDisconnect }: DappSectionProps) => {
  const [dappUrl, setDappUrl] = useState<string>("");
  const { toast } = useToast();

  const handleDappConnect = async () => {
    if (!dappUrl) {
      toast({
        title: "Error",
        description: "Please enter a dApp URL",
        variant: "destructive",
      });
      return;
    }

    if (!peraAddress) {
      toast({
        title: "Error",
        description: "Please connect your Pera Wallet first",
        variant: "destructive",
      });
      return;
    }

    console.log("Connecting to dApp:", dappUrl);
    toast({
      title: "DApp Connection",
      description: `Attempting to connect to ${dappUrl}`,
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Pera Wallet connected:
      </p>
      <code className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm break-all block">
        {peraAddress}
      </code>
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter dApp URL"
            value={dappUrl}
            onChange={(e) => setDappUrl(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={handleDappConnect}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Link className="mr-2 h-4 w-4" />
            Connect
          </Button>
        </div>
        <Button
          onClick={onDisconnect}
          variant="outline"
          className="w-full"
        >
          Disconnect Pera Wallet
        </Button>
      </div>
    </div>
  );
};