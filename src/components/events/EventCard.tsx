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
    <Card className="group overflow-hidden transition-all duration-500 hover:shadow-xl bg-hendricks-dark border border-hendricks-gold/20">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={event.image_url}
          alt={event.title}
          className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-hendricks-dark to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="p-8 space-y-6">
        <h3 className="text-2xl font-bold font-serif text-hendricks-cream">
          {event.title}
        </h3>
        <p className="text-hendricks-cream/80 line-clamp-2 text-base font-sans">
          {event.description}
        </p>
        <div className="flex flex-col gap-3 text-sm font-sans">
          <div className="flex items-center gap-3 text-hendricks-cream/60 hover:text-hendricks-gold transition-colors">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">{format(new Date(event.date), "PPP 'at' p")}</span>
          </div>
          <div className="flex items-center gap-3 text-hendricks-cream/60 hover:text-hendricks-gold transition-colors">
            <MapPin className="w-5 h-5" />
            <span className="font-medium">{event.location}</span>
          </div>
        </div>
        <Button 
          className="w-full bg-hendricks-green hover:bg-hendricks-green/90 text-hendricks-cream font-serif font-bold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border border-hendricks-gold/20"
        >
          MINT NFT
        </Button>
      </div>
    </Card>
  );
};