import React from 'react';
import { QrReader } from 'react-qr-reader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Scan } from "lucide-react";

interface QRScannerProps {
  onResult: (result: string) => void;
}

export const QRScanner = ({ onResult }: QRScannerProps) => {
  return (
    <Dialog>
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
            onResult={(result) => {
              if (result) {
                onResult(result.getText());
              }
            }}
            className="w-full h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};