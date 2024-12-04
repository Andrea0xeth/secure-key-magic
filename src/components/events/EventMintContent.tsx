import { FC } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  date: string;
  image_url: string;
}

interface EventMintContentProps {
  event: Event;
  isMinting: boolean;
  onMint: () => void;
}

export const EventMintContent: FC<EventMintContentProps> = ({ event, isMinting, onMint }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4">
      <h2 className="text-xl font-semibold text-center">Mint Event NFT</h2>
      <p className="text-center text-gray-600">
        You're about to mint an NFT for the event "{event.title}". This NFT will be added to your collection.
      </p>
      <Button
        onClick={onMint}
        disabled={isMinting}
        className="w-full"
      >
        {isMinting ? "Minting..." : "Mint NFT"}
      </Button>
    </div>
  );
};