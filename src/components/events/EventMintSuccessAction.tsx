import { FC } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EventMintSuccessActionProps {
  onClose: () => void;
}

export const EventMintSuccessAction: FC<EventMintSuccessActionProps> = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => {
        onClose();
        navigate('/my-nfts');
      }}
      className="bg-white hover:bg-gray-100 text-artence-purple border-artence-purple"
    >
      View My NFTs
    </Button>
  );
};