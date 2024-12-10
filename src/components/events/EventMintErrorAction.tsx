import { FC } from "react";
import { Button } from "@/components/ui/button";

interface EventMintErrorActionProps {
  setExpanded: (expanded: boolean) => void;
}

export const EventMintErrorAction: FC<EventMintErrorActionProps> = ({ setExpanded }) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => setExpanded(true)}
      className="bg-white hover:bg-gray-100 text-red-600 border-red-200"
    >
      Open Wallet
    </Button>
  );
};