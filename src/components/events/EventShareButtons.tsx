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
    // Instagram story sharing URL scheme with all required parameters
    const storyUrl = `instagram-stories://share?` + 
      `source_application=artence&` +
      `background_image=${encodeURIComponent(event.image_url)}&` +
      `background_color=%23000000&` +
      `title=${encodeURIComponent(event.title)}&` +
      `caption=${encodeURIComponent(event.description)}&` +
      `sticker_text=${encodeURIComponent('Check out this event!')}&` +
      `attribution_link=${encodeURIComponent(currentUrl)}`;
    
    console.log('Opening Instagram with URL:', storyUrl);
    
    // Try to open Instagram stories
    window.location.href = storyUrl;
    
    // Set a timeout to check if Instagram app was opened
    setTimeout(() => {
      // If we're still here after a short delay, Instagram app probably isn't installed
      if (document.hasFocus()) {
        toast.error("Instagram app not found. Please install Instagram to share stories.");
      }
    }, 500);
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