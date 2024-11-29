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
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg bg-white/5 backdrop-blur-sm border-gray-800/50">
      <div className="aspect-video relative">
        <img
          src={event.image_url}
          alt={event.title}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-semibold text-white">
          {event.title}
        </h3>
        <p className="text-gray-300">
          {event.description}
        </p>
        <div className="flex flex-col gap-2 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(event.date), "PPP 'at' p")}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
        </div>
        <Button className="w-full bg-artence-green hover:bg-artence-green/90 text-white">
          {event.nft_asset_id ? "View NFT" : "Register Interest"}
        </Button>
      </div>
    </Card>
  );
};