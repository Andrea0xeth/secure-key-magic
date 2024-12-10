import { FC } from "react";
import { NFTCard } from "./NFTCard";

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

interface NFTGridProps {
  nfts: NFTEvent[];
}

export const NFTGrid: FC<NFTGridProps> = ({ nfts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {nfts.map((nft) => (
        <NFTCard key={nft.asset_id} nft={nft} />
      ))}
    </div>
  );
};