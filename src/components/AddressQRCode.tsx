import { QRCodeSVG } from 'qrcode.react';

interface AddressQRCodeProps {
  address: string;
}

export const AddressQRCode = ({ address }: AddressQRCodeProps) => {
  return (
    <div className="flex flex-col items-center space-y-2 p-4 bg-white dark:bg-gray-800 rounded-lg transition-colors duration-300">
      <QRCodeSVG value={address} size={128} />
      <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">Scan to get address</span>
    </div>
  );
};