import { FC } from "react";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { format } from "date-fns";

interface EventDetailsProps {
  title: string;
  date: string;
  location: string;
  description: string;
}

export const EventDetails: FC<EventDetailsProps> = ({
  title,
  date,
  location,
  description,
}) => {
  const formattedDate = format(new Date(date), "MMM d, yyyy");

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg">{title}</h3>
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <CalendarIcon className="w-4 h-4" />
        <span>{formattedDate}</span>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <MapPinIcon className="w-4 h-4" />
        <span>{location}</span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
        {description}
      </p>
    </div>
  );
};