import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { authenticateWithPasskey } from "@/lib/webauthn";
import { useToast } from "@/components/ui/use-toast";
import * as algosdk from "algosdk";
import { Card } from "@/components/ui/card";

interface TransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: algosdk.Transaction | null;
  onSign: (signedTxn: Uint8Array) => void;
}

export const TransactionDialog = ({ isOpen, onClose, transaction, onSign }: TransactionDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSign = async () => {
    if (!transaction) {
      console.error("Nessuna transazione da firmare");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Avvio processo di firma della transazione");
      
      const authResult = await authenticateWithPasskey();
      if (!authResult) {
        console.error("Autenticazione con passkey fallita");
        toast({
          title: "Autenticazione Fallita",
          description: "Impossibile autenticare con la passkey",
          variant: "destructive",
        });
        return;
      }

      console.log("Autenticazione riuscita, firma della transazione in corso");
      const signedTxn = algosdk.signTransaction(transaction, authResult.privateKey);
      onSign(signedTxn.blob);
      
      toast({
        title: "Transazione Firmata",
        description: "La transazione è stata firmata con successo",
      });
      
      onClose();
    } catch (error) {
      console.error("Errore durante la firma della transazione:", error);
      toast({
        title: "Firma Fallita",
        description: "Impossibile firmare la transazione",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatAlgoAmount = (amount: number | bigint): string => {
    const numericAmount = typeof amount === 'bigint' ? Number(amount) : amount;
    return (numericAmount / 1_000_000).toFixed(6);
  };

  if (!transaction) return null;

  const txnDetails = {
    type: "Payment",
    fee: formatAlgoAmount(transaction.fee),
    from: algosdk.encodeAddress(transaction.from.publicKey),
    to: algosdk.encodeAddress(transaction.to.publicKey),
    amount: formatAlgoAmount(transaction.amount)
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Firma Transazione</DialogTitle>
          <DialogDescription>
            Rivedi e firma la transazione con la tua passkey
          </DialogDescription>
        </DialogHeader>
        
        <Card className="p-4 space-y-3">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Dettagli Transazione</h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <span className="text-muted-foreground">Tipo:</span>
              <span className="col-span-2 font-medium">{txnDetails.type}</span>
              
              <span className="text-muted-foreground">Fee:</span>
              <span className="col-span-2 font-medium">{txnDetails.fee} ALGO</span>
              
              <span className="text-muted-foreground">Da:</span>
              <span className="col-span-2 font-medium break-all">{txnDetails.from}</span>
              
              <span className="text-muted-foreground">A:</span>
              <span className="col-span-2 font-medium break-all">{txnDetails.to}</span>
              
              <span className="text-muted-foreground">Importo:</span>
              <span className="col-span-2 font-medium">{txnDetails.amount} ALGO</span>
            </div>
          </div>
        </Card>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Annulla
          </Button>
          <Button 
            onClick={handleSign} 
            disabled={isLoading}
            className="bg-artence-purple hover:bg-artence-purple/90"
          >
            {isLoading ? "Firma in corso..." : "Firma con Passkey"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};