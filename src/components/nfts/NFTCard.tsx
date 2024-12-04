import { FC } from "react";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface NFTEvent {
  events: {
    title: string;
    description: string;
    image_url: string;
    date: string;
    location: string;
    nft_asset_id: string;
  };
  asset_id: string;
  minted_at: string;
}

interface NFTCardProps {
  nft: NFTEvent;
}

export const NFTCard: FC<NFTCardProps> = ({ nft }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={nft.events.image_url} 
          alt={nft.events.title}
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader className="space-y-1">
        <h3 className="text-xl font-semibold text-center">{nft.events.title}</h3>
        <div className="flex justify-center w-full">
          <a 
            href={`https://testnet.explorer.perawallet.app/asset/${nft.asset_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-artence-purple hover:text-artence-purple/80 flex items-center gap-1 justify-center"
          >
            Asset ID: {nft.asset_id}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Minted: {new Date(nft.minted_at).toLocaleDateString()}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2 text-center">{nft.events.description}</p>
        <div className="flex flex-col gap-1 text-sm items-center">
          <p>📍 {nft.events.location}</p>
          <p>📅 {new Date(nft.events.date).toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};