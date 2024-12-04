import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { EventCardImage } from "./EventCardImage";
import { EventCardHeader } from "./EventCardHeader";
import { EventCardContent } from "./EventCardContent";
import { EventMintDialog } from "./EventMintDialog";
import { Event } from "@/lib/types/event";

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
      
      <div className="relative h-full p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between">
        <EventCardHeader title={event.title} date={formattedDate} />
        <EventCardContent
          location={event.location}
          description={event.description}
          onMintClick={handleOpenDialog}
        />
      </div>

      <EventMintDialog
        event={event}
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        isMinting={false}
        onMint={async () => {}}
        onNavigateToNFTs={() => {}}
      />
    </Card>
  );
};