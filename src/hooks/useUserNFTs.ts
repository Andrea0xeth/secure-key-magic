import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserNFTs = () => {
  return useQuery({
    queryKey: ['userNFTs'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

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
    },
  });
};