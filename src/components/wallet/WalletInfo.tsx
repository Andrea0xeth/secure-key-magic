import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AlgoBalance } from "../AlgoBalance";
import { AddressQRCode } from "../AddressQRCode";
import { ConnectedAppsList } from "../ConnectedAppsList";
import { ExportSeedDialog } from "./ExportSeedDialog";

interface WalletInfoProps {
  address: string;
}

export const WalletInfo = ({ address }: WalletInfoProps) => {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const { toast } = useToast();

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address Copied",
      description: "The wallet address has been copied to your clipboard",
    });
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 5)}...${address.slice(-5)}`;
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs block text-gray-800 dark:text-gray-200 transition-colors duration-300">
          {truncateAddress(address)}
        </code>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={handleCopyAddress}
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>

      <div>
        <AlgoBalance address={address} />
      </div>

      <div className="py-2">
        <AddressQRCode address={address} />
      </div>

      <div className="pt-2 border-t dark:border-gray-800">
        <Button
          variant="outline"
          onClick={() => setShowExportDialog(true)}
          className="w-full border-artence-purple text-artence-purple hover:bg-artence-purple/10 py-1 h-8 text-sm"
        >
          <Download className="mr-2 h-3 w-3" />
          Export Seed Phrase
        </Button>
      </div>

      <ExportSeedDialog 
        open={showExportDialog} 
        onOpenChange={setShowExportDialog} 
      />
    </div>
  );
};