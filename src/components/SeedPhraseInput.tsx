import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import * as algosdk from "algosdk";
import { storeAlgorandKey } from "@/lib/storage/keyStorage";

export const SeedPhraseInput = ({ onSuccess }: { onSuccess: (address: string) => void }) => {
  const [seedPhrase, setSeedPhrase] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate and process the seed phrase
      const trimmedPhrase = seedPhrase.trim();
      const words = trimmedPhrase.split(" ");
      
      if (words.length !== 25) {
        toast({
          title: "Invalid Seed Phrase",
          description: "Please enter exactly 25 words",
          variant: "destructive",
        });
        return;
      }

      // Validate and convert to account
      const account = algosdk.mnemonicToSecretKey(trimmedPhrase);
      storeAlgorandKey(trimmedPhrase);
      
      onSuccess(account.addr);
      
      toast({
        title: "Success",
        description: "Account recovered successfully",
      });
    } catch (error) {
      console.error("Error processing seed phrase:", error);
      toast({
        title: "Invalid Seed Phrase",
        description: "Please check your seed phrase and try again",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Enter your 25-word seed phrase"
          value={seedPhrase}
          onChange={(e) => setSeedPhrase(e.target.value)}
          className="font-mono"
        />
        <p className="text-sm text-muted-foreground mt-2">
          Enter your 25 words separated by spaces
        </p>
      </div>
      <Button type="submit" className="w-full">
        Recover Account
      </Button>
    </form>
  );
};