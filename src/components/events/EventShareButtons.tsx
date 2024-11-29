import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { toast } from "sonner";

interface EventShareProps {
  event: {
    title: string;
    description: string;
    image_url: string;
  };
}

export const EventShareButtons = ({ event }: EventShareProps) => {
  const currentUrl = window.location.href;
  
  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const text = `Check out this event: ${event.title}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToInstagram = () => {
    // Instagram doesn't have a direct web sharing API
    // We'll copy the event details to clipboard instead
    const text = `${event.title}\n\n${event.description}\n\nCheck it out at: ${currentUrl}`;
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Event details copied! Open Instagram to share.");
    });
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={shareToFacebook}
        className="hover:text-blue-600 hover:border-blue-600"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={shareToTwitter}
        className="hover:text-sky-500 hover:border-sky-500"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={shareToInstagram}
        className="hover:text-pink-600 hover:border-pink-600"
      >
        <Instagram className="h-4 w-4" />
      </Button>
    </div>
  );
};