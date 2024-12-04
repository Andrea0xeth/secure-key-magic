import { FC } from "react";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventShareButtons } from "./EventShareButtons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Event {
  id: string;
  title: string;
  description: string;
  image_url: string;
  date: string;
  location: string;
  nft_asset_id?: string;
}

interface EventMintDialogProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

export const EventMintDialog: FC<EventMintDialogProps> = ({
  event,
  isOpen,
  onClose,
}) => {
  const formattedDate = format(new Date(event.date), "MMM d, yyyy");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-artence-navy border-artence-purple sm:rounded-lg w-full sm:w-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Mint Event NFT
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{event.title}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <CalendarIcon className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <MapPinIcon className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              {event.description}
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-center">
              <EventShareButtons event={event} />
            </div>
            <Button 
              className="w-full bg-artence-purple hover:bg-white hover:text-artence-purple border-2 border-transparent hover:border-artence-purple transition-all duration-300"
            >
              Confirm Mint
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};