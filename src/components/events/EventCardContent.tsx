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
    <div className="space-y-3 sm:space-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col h-full">
      <div className="flex items-center space-x-2 text-[10px] sm:text-xs text-white/80">
        <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="truncate">{location}</span>
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        <p className="text-xs sm:text-sm text-white/90 line-clamp-3 mb-3">
          {description}
        </p>
        <div className="mt-auto">
          <Button 
            className="w-full h-8 sm:h-10 text-xs sm:text-sm bg-artence-purple hover:bg-white hover:text-artence-purple transition-colors duration-300"
            onClick={onMintClick}
          >
            MINT NFT
          </Button>
        </div>
      </div>
    </div>
  );
};