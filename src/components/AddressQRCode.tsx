import { QRCodeSVG } from 'qrcode.react';

interface AddressQRCodeProps {
  address: string;
}

export const AddressQRCode = ({ address }: AddressQRCodeProps) => {
  return (
    <div className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg">
      <QRCodeSVG value={address} size={128} />
      <span className="text-xs text-muted-foreground">Scan to get address</span>
    </div>
  );
};