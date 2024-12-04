import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Event {
  id: string;
  title: string;
  description: string;
  image_url: string;
  date: string;
  location: string;
}

interface EventShareButtonsProps {
  event: Event;
}

export const EventShareButtons: FC<EventShareButtonsProps> = ({ event }) => {
  const { toast } = useToast();

  const shareUrl = window.location.href;
  const shareText = `Check out ${event.title} on Artence!`;

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied!",
        description: "The event link has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2 z-[50]">
      <Button
        variant="outline"
        size="icon"
        onClick={handleFacebookShare}
        className="hover:text-blue-600 hover:border-blue-600"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleTwitterShare}
        className="hover:text-sky-500 hover:border-sky-500"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleCopyLink}
        className="hover:text-violet-600 hover:border-violet-600"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};