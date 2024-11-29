import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <Card className="group overflow-hidden transition-all duration-500 hover:shadow-xl bg-white dark:bg-black border-2 border-gray-100 dark:border-gray-800 h-[400px]">
      <div className="relative h-3/4">
        <img
          src={event.image_url}
          alt={event.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="p-4 h-1/4 flex flex-col justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
          {event.title}
        </h3>
        <Button 
          className="w-full bg-artence-purple hover:bg-artence-purple/90 text-white font-bold"
        >
          MINT NFT
        </Button>
      </div>
    </Card>
  );
};