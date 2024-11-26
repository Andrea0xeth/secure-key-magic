import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Scan } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QRScannerProps {
  onResult: (result: string) => void;
}

export const QRScanner = ({ onResult }: QRScannerProps) => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      console.log("Device check - is mobile:", mobile);
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleScan = (result: any) => {
    console.log("Scanning attempt...", result);
    
    if (result?.text) {
      console.log("QR Code detected with text:", result.text);
      
      if (result.text.startsWith('wc:')) {
        console.log("Valid WalletConnect URL detected");
        onResult(result.text);
        setOpen(false);
        toast({
          title: "QR Code Detected",
          description: "WalletConnect URL found and processed",
        });
      }
    }
  };

  const handleError = (error: any) => {
    console.error("QR Scanner error:", error);
    toast({
      title: "Scanner Error",
      description: "There was an error with the QR scanner",
      variant: "destructive",
    });
  };

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
            onError={handleError}
            className="w-full h-full"
            scanDelay={300}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};