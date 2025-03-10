import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type TokenType = "soulbound" | "erc1155";

interface MintingOptionsProps {
  onSelect: (type: TokenType) => void;
  isLoading?: boolean;
}

export function MintingOptions({ onSelect, isLoading = false }: MintingOptionsProps) {
  const [selectedType, setSelectedType] = useState<TokenType>("soulbound");

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Scegli il tipo di Token</CardTitle>
        <CardDescription>
          Seleziona il tipo di token che desideri mintare per questo evento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedType}
          onValueChange={(value: TokenType) => setSelectedType(value)}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
            <RadioGroupItem value="soulbound" id="soulbound" />
            <Label htmlFor="soulbound" className="flex-1 cursor-pointer">
              <div className="font-semibold">Soulbound NFT</div>
              <div className="text-sm text-muted-foreground">
                Token non trasferibile, perfetto per certificati di partecipazione
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
            <RadioGroupItem value="erc1155" id="erc1155" />
            <Label htmlFor="erc1155" className="flex-1 cursor-pointer">
              <div className="font-semibold">ERC-1155</div>
              <div className="text-sm text-muted-foreground">
                Token multi-fungibile, ideale per collezioni e oggetti scambiabili
              </div>
            </Label>
          </div>
        </RadioGroup>

        <Button 
          className="w-full mt-6"
          onClick={() => onSelect(selectedType)}
          disabled={isLoading}
        >
          {isLoading ? "Caricamento..." : "Continua"}
        </Button>
      </CardContent>
    </Card>
  );
} 