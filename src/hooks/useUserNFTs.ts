
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { mockUserNFTs } from "@/lib/mockData";

export const useUserNFTs = () => {
  return useQuery({
    queryKey: ['userNFTs'],
    queryFn: async () => {
      try {
        console.log("Checking auth status...");
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log("User not authenticated, returning empty array");
          return [];
        }

        console.log("Fetching NFTs for user:", user.id);
        
        const { data, error } = await supabase
          .from('user_nfts')
          .select(`
            asset_id,
            minted_at,
            events (
              title,
              description,
              image_url,
              date,
              location,
              nft_asset_id
            )
          `)
          .eq('user_id', user.id);

        if (error) {
          console.error("Error fetching NFTs:", error);
          throw error;
        }

        console.log("Found NFTs:", data);
        return data;
      } catch (error) {
        console.error("Failed to fetch user NFTs:", error);
        
        // Show toast notification only if not an auth error
        if (!(error.message && error.message.includes("Not authenticated"))) {
          toast.error("Could not connect to the database. Using local data instead.", {
            description: "The application is running in offline mode with sample data."
          });
        }
        
        // Return mock data as fallback only if this isn't an auth error
        return mockUserNFTs;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
