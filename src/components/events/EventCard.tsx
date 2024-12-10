import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { EventCardImage } from "./EventCardImage";
import { EventCardHeader } from "./EventCardHeader";
import { EventCardContent } from "./EventCardContent";
import { EventMintDialog } from "./EventMintDialog";

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
  const navigate = useNavigate();
  const location = useLocation();
  const formattedDate = format(new Date(event.date), "MMM d, yyyy");
  
  const isDialogOpen = location.hash === `#mint-${event.id}`;

  const handleOpenDialog = () => {
    navigate(`${location.pathname}#mint-${event.id}`);
  };

  const handleCloseDialog = () => {
    navigate(location.pathname);
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-500 bg-white dark:bg-black border border-gray-100 dark:border-gray-800 aspect-square hover:border-artence-purple dark:hover:border-artence-purple">
      <EventCardImage imageUrl={event.image_url} title={event.title} />
      
      <div className="relative h-full p-4 sm:p-6 flex flex-col justify-between">
        <EventCardHeader title={event.title} date={formattedDate} />
        <EventCardContent
          location={event.location}
          description={event.description}
          onMintClick={handleOpenDialog}
        />
      </div>

      <EventMintDialog
        event={event}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </Card>
  );
};