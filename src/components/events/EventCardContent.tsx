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
    <div className="space-y-2 sm:space-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 h-full">
      <div className="flex items-center space-x-1 sm:space-x-2 text-[10px] xs:text-xs text-white/80">
        <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="truncate">{location}</span>
      </div>
      <div className="h-full pb-12 sm:pb-16 relative">
        <p className="text-[11px] xs:text-sm text-white/90 line-clamp-3 overflow-hidden">
          {description}
        </p>
        <div className="absolute bottom-0 left-0 right-0 py-2 sm:py-4">
          <Button 
            className="w-full bg-artence-purple hover:bg-white hover:text-artence-purple transition-colors duration-300 h-8 sm:h-10 text-xs sm:text-sm"
            onClick={onMintClick}
          >
            MINT NFT
          </Button>
        </div>
      </div>
    </div>
  );
};