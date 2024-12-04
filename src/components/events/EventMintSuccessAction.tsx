import { FC } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const EventMintSuccessAction: FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => {
        toast.dismiss();
        navigate('/my-nfts');
      }}
      className="bg-success hover:bg-success/90 text-white border-success hover:border-success/90"
    >
      View My NFTs
    </Button>
  );
};