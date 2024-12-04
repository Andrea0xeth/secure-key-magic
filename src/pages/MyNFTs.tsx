import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ImageIcon, RefreshCcw } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getStoredAlgorandKey } from "@/lib/storage/keyStorage";

interface NFTEvent {
  title: string;
  description: string;
  image_url: string;
  date: string;
  location: string;
  nft_asset_id: string;
}

const MyNFTs = () => {
  const navigate = useNavigate();
  const [nfts, setNfts] = useState<NFTEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserNFTs = async () => {
    try {
      setLoading(true);
      const walletAddress = getStoredAlgorandKey();
      
      if (!walletAddress) {
        console.log("No wallet address found");
        return;
      }

      console.log("Fetching NFTs for wallet:", walletAddress);
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .not('nft_asset_id', 'is', null);

      if (error) {
        console.error("Error fetching NFTs:", error);
        return;
      }

      console.log("Found NFTs:", data);
      setNfts(data as NFTEvent[]);
    } catch (error) {
      console.error("Error in fetchUserNFTs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
      } else {
        fetchUserNFTs();
      }
    };
    
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-radial from-white via-gray-50 to-gray-100 dark:from-artence-navy dark:via-artence-dark dark:to-black transition-colors duration-300">
      <AppHeader />
      <div className="w-full px-4 pt-24 pb-8 animate-fade-in">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-artence-navy dark:text-white">
              My NFTs Collection
            </h1>
            <Button
              variant="outline"
              className="flex items-center gap-2 hover:bg-artence-purple/10"
              onClick={fetchUserNFTs}
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
          
          {loading ? (
            <div className="grid place-items-center min-h-[60vh]">
              <div className="animate-pulse">Loading NFTs...</div>
            </div>
          ) : nfts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nfts.map((nft) => (
                <Card key={nft.nft_asset_id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={nft.image_url} 
                      alt={nft.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardHeader className="space-y-1">
                    <h3 className="text-xl font-semibold">{nft.title}</h3>
                    <p className="text-sm text-muted-foreground">Asset ID: {nft.nft_asset_id}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{nft.description}</p>
                    <div className="flex flex-col gap-1 text-sm">
                      <p>📍 {nft.location}</p>
                      <p>📅 {new Date(nft.date).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid min-h-[60vh] place-items-center">
              <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 backdrop-blur-sm max-w-md w-full">
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 bg-artence-purple/10 rounded-full animate-pulse"></div>
                  <ImageIcon className="w-full h-full text-gray-400 dark:text-gray-500 p-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  No NFTs Found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                  You don't have any NFTs in your collection yet. Once you acquire NFTs, they will appear here.
                </p>
                <Button
                  variant="outline"
                  className="bg-artence-purple/5 hover:bg-artence-purple/10 border-artence-purple/20"
                  onClick={() => navigate('/')}
                >
                  Explore Events
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyNFTs;