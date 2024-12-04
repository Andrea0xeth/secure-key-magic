import { FC } from "react";
import { CalendarIcon } from "lucide-react";

interface EventCardHeaderProps {
  title: string;
  date: string;
}

export const EventCardHeader: FC<EventCardHeaderProps> = ({ title, date }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <CalendarIcon className="w-4 h-4" />
        <span>{date}</span>
      </div>
      <h3 className="text-xl font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
        {title}
      </h3>
    </div>
  );
};