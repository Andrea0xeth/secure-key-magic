import { FC } from "react";
import { MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventCardContentProps {
  location: string;
  description: string;
  onMintClick: () => void;
}

export const EventCardContent: FC<EventCardContentProps> = ({
  location,
  description,
  onMintClick,
}) => {
  return (
    <div className="space-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div className="flex items-center space-x-2 text-xs text-white/80">
        <MapPinIcon className="w-4 h-4" />
        <span className="truncate">{location}</span>
      </div>
      <div className="flex flex-col justify-end h-full space-y-4">
        <p className="text-sm text-white/90 line-clamp-3 overflow-hidden">
          {description}
        </p>
        <Button 
          className="w-full bg-artence-purple hover:bg-white hover:text-artence-purple transition-colors duration-300"
          onClick={onMintClick}
        >
          MINT NFT
        </Button>
      </div>
    </div>
  );
};