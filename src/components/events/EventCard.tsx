import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
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
  return (
    <Card className="group overflow-hidden transition-all duration-500 hover:shadow-xl bg-white dark:bg-artence-dark border-none">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={event.image_url}
          alt={event.title}
          className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="p-8 space-y-6">
        <h3 className="text-2xl font-bold text-artence-navy dark:text-white">
          {event.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 line-clamp-2 text-base">
          {event.description}
        </p>
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 hover:text-artence-purple dark:hover:text-artence-purple transition-colors">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">{format(new Date(event.date), "PPP 'at' p")}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 hover:text-artence-purple dark:hover:text-artence-purple transition-colors">
            <MapPin className="w-5 h-5" />
            <span className="font-medium">{event.location}</span>
          </div>
        </div>
        <Button 
          className="w-full bg-artence-purple hover:bg-artence-purple/90 text-white font-bold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        >
          MINT NFT
        </Button>
      </div>
    </Card>
  );
};