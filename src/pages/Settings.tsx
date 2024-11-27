import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getStoredMnemonic } from "@/lib/storage/keyStorage";
import { ArrowLeft, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const mnemonic = getStoredMnemonic();

  const handleCopyMnemonic = async () => {
    if (mnemonic) {
      try {
        await navigator.clipboard.writeText(mnemonic);
        toast({
          title: "Copied to clipboard",
          description: "Your seed phrase has been copied to your clipboard",
        });
      } catch (error) {
        toast({
          title: "Failed to copy",
          description: "Could not copy seed phrase to clipboard",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-artence-navy dark:to-gray-900 transition-colors duration-300">
      <div className="container max-w-2xl px-4 sm:px-6 pt-16 pb-8 animate-fade-in">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-artence-purple hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Wallet
          </Link>
        </div>

        <Card className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center mb-6">Settings</h1>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Seed Phrase</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your 25-word recovery phrase. Keep it safe and never share it with anyone.
            </p>
            {mnemonic ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm break-all font-mono">{mnemonic}</p>
                </div>
                <Button
                  onClick={handleCopyMnemonic}
                  className="w-full bg-artence-purple hover:bg-artence-purple/90"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Seed Phrase
                </Button>
              </div>
            ) : (
              <p className="text-sm text-red-500">
                No seed phrase available. Please connect your wallet first.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;