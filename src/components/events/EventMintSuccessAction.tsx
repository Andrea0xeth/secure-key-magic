import { FC } from "react";
import { ToastAction } from "@/components/ui/toast";
import { useNavigate } from "react-router-dom";

interface EventMintSuccessActionProps {
  altText?: string;
}

export const EventMintSuccessAction: FC<EventMintSuccessActionProps> = ({ altText = "View NFTs" }) => {
  const navigate = useNavigate();

  return (
    <ToastAction 
      altText={altText}
      onClick={() => navigate('/my-nfts')}
      className="bg-white hover:bg-gray-100 text-artence-purple border-artence-purple"
    >
      View My NFTs
    </ToastAction>
  );
};