import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Scan } from "lucide-react";

interface QRScannerProps {
  onResult: (result: string) => void;
}

export const QRScanner = ({ onResult }: QRScannerProps) => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      console.log("Device check - is mobile:", mobile);
      setIsMobile(mobile);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleScan = (result: { getText(): string } | null) => {
    if (result) {
      const text = result.getText();
      console.log("QR Scan result:", text);
      
      if (text.startsWith('wc:')) {
        console.log("Valid WalletConnect URL detected");
        onResult(text);
        setOpen(false);
      }
    }
  };

  // If not mobile, don't render anything
  if (!isMobile) {
    console.log("QR Scanner not rendered - desktop device detected");
    return null;
  }

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