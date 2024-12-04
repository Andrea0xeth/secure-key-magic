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
      {/* Address Section */}
      <div className="relative">
        <code className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs sm:text-sm block text-gray-800 dark:text-gray-200 transition-colors duration-300">
          {truncateAddress(address)}
        </code>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={handleCopyAddress}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>

      {/* Balance Section */}
      <div>
        <AlgoBalance address={address} />
      </div>

      {/* QR Code Section */}
      <div>
        <AddressQRCode address={address} />
      </div>

      {/* Connected Apps Section - Only show if there are connected apps */}
      <ConnectedAppsList />

      {/* Export Seed Phrase Button - Moved to bottom */}
      <Button
        variant="outline"
        onClick={() => setShowExportDialog(true)}
        className="w-full border-artence-purple text-artence-purple hover:bg-artence-purple/10"
      >
        <Download className="mr-2 h-4 w-4" />
        Export Seed Phrase
      </Button>

      <ExportSeedDialog 
        open={showExportDialog} 
        onOpenChange={setShowExportDialog} 
      />
    </div>
  );
};