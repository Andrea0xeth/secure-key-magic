import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string;
  image_url: string;
  date: string;
  location: string;
  nft_asset_id?: string;
}

export const EventCard = ({ event }: { event: Event }) => {
  const formattedDate = format(new Date(event.date), "MMM d, yyyy");

  return (
    <Card className="group relative overflow-hidden transition-all duration-500 bg-white dark:bg-black border border-gray-100 dark:border-gray-800 aspect-square hover:border-artence-purple dark:hover:border-artence-purple">
      {/* Image Container */}
      <div className="absolute inset-0">
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content Container */}
      <div className="relative h-full p-6 flex flex-col justify-between">
        {/* Top Content */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <CalendarIcon className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <h3 className="text-xl font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
            {event.title}
          </h3>
        </div>

        {/* Bottom Content - Only visible on hover */}
        <div className="space-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center space-x-2 text-xs text-white/80">
            <MapPinIcon className="w-4 h-4" />
            <span className="truncate">{event.location}</span>
          </div>
          <p className="text-sm text-white/90 line-clamp-3">
            {event.description}
          </p>
          <Button 
            className="w-full bg-artence-purple hover:bg-white hover:text-artence-purple transition-colors duration-300"
          >
            MINT NFT
          </Button>
        </div>
      </div>
    </Card>
  );
};