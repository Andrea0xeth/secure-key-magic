import { FC } from "react";

interface EventCardImageProps {
  imageUrl: string;
  title: string;
}

export const EventCardImage: FC<EventCardImageProps> = ({ imageUrl, title }) => {
  return (
    <div className="absolute inset-0">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};