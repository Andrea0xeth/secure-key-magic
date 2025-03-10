import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useMintNFT } from "@/hooks/useMintNFT";
import { MintingOptions, TokenType } from "./MintingOptions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url: string;
}

interface EventCardProps {
  event: Event;
  onMintSuccess: () => void;
}

export function EventCard({ event, onMintSuccess }: EventCardProps) {
  const [showMintDialog, setShowMintDialog] = useState(false);
  const { mintNFT, isMinting } = useMintNFT(event, () => {
    onMintSuccess();
    setShowMintDialog(false);
  });

  const handleMintSelection = async (tokenType: TokenType) => {
    await mintNFT(tokenType);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>
          {format(new Date(event.date), "dd MMMM yyyy")} - {event.location}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {event.image_url && (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        )}
        <p className="text-sm text-muted-foreground">{event.description}</p>
      </CardContent>
      
      <CardFooter>
        <Dialog open={showMintDialog} onOpenChange={setShowMintDialog}>
          <DialogTrigger asChild>
            <Button className="w-full">Mint NFT</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mint NFT per {event.title}</DialogTitle>
              <DialogDescription>
                Scegli il tipo di NFT che desideri mintare per questo evento
              </DialogDescription>
            </DialogHeader>
            <MintingOptions 
              onSelect={handleMintSelection}
              isLoading={isMinting}
            />
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
} 