import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { authenticateWithPasskey } from "@/lib/webauthn";
import { useToast } from "@/components/ui/use-toast";

interface ExportSeedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExportSeedDialog = ({ open, onOpenChange }: ExportSeedDialogProps) => {
  const { toast } = useToast();

  const handleExportSeed = async () => {
    try {
      const authResult = await authenticateWithPasskey();
      if (!authResult) {
        throw new Error("Authentication failed");
      }

      // Create a Blob with the mnemonic
      const seedBlob = new Blob([authResult.mnemonic], { type: 'text/plain' });
      const url = window.URL.createObjectURL(seedBlob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `seed-phrase-${authResult.address.slice(0, 5)}...${authResult.address.slice(-5)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      onOpenChange(false);
      toast({
        title: "Seed Phrase Exported",
        description: "Your seed phrase has been exported successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error exporting seed phrase:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export seed phrase. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Export Seed Phrase</AlertDialogTitle>
          <AlertDialogDescription>
            You will need to authenticate with your passkey to export your seed phrase. 
            Keep this file secure and never share it with anyone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleExportSeed}
            className="bg-artence-purple hover:bg-artence-purple/90"
          >
            Continue with Passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};