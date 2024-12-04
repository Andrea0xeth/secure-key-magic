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
    <div className="flex flex-col h-full justify-between space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      {/* Location section */}
      <div className="flex items-center space-x-2 text-xs sm:text-sm text-white/80">
        <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="truncate">{location}</span>
      </div>

      {/* Description section with adaptive text size */}
      <div className="flex-grow">
        <p className="text-xs sm:text-sm md:text-base text-white/90 line-clamp-3">
          {description}
        </p>
      </div>

      {/* Button section - fixed at bottom */}
      <div className="w-full mt-auto pt-2">
        <Button 
          className="w-full bg-artence-purple hover:bg-white hover:text-artence-purple transition-colors duration-300 text-xs sm:text-sm py-2"
          onClick={onMintClick}
        >
          MINT NFT
        </Button>
      </div>
    </div>
  );
};