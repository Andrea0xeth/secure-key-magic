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
    <Card className="group overflow-hidden transition-all duration-500 hover:shadow-xl bg-white dark:bg-black border-2 border-gray-100 dark:border-gray-800 aspect-square">
      <div className="relative h-2/5">
        <img
          src={event.image_url}
          alt={event.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="p-4 h-3/5 flex flex-col justify-between">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
            {event.title}
          </h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <CalendarIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <MapPinIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {event.description}
          </p>
        </div>
        <Button 
          className="w-full bg-artence-purple hover:bg-artence-purple/90 text-white font-bold"
        >
          MINT NFT
        </Button>
      </div>
    </Card>
  );
};