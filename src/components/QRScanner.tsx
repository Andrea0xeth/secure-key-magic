import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Scan } from "lucide-react";

interface QRScannerProps {
  onResult: (result: string) => void;
}

export const QRScanner = ({ onResult }: QRScannerProps) => {
  const [open, setOpen] = useState(false);

  const handleScan = (result: { getText(): string } | null) => {
    if (result) {
      const text = result.getText();
      console.log("QR Scan result:", text);
      
      // Check if it's a WalletConnect URL (starts with "wc:")
      if (text.startsWith('wc:')) {
        console.log("Valid WalletConnect URL detected");
        onResult(text);
        setOpen(false); // Close the modal
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          <Scan className="mr-2 h-4 w-4" />
          Scan QR
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan WalletConnect QR Code</DialogTitle>
        </DialogHeader>
        <div className="w-full aspect-square">
          <QrReader
            constraints={{ facingMode: 'environment' }}
            onResult={handleScan}
            className="w-full h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};