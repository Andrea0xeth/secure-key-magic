import { FC } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const EventMintSuccessAction: FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/my-nfts');
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleClick}
      className="bg-success hover:bg-success/90 text-white border-success hover:border-success/90 font-medium mt-4 w-full"
    >
      View My NFTs Collection
    </Button>
  );
};