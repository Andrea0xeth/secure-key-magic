import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ImageIcon, RefreshCcw } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { useUserNFTs } from "@/hooks/useUserNFTs";
import { NFTGrid } from "@/components/nfts/NFTGrid";

const EmptyNFTsState = ({ onExplore }: { onExplore: () => void }) => (
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
        onClick={onExplore}
      >
        Explore Events
      </Button>
    </div>
  </div>
);

const MyNFTs = () => {
  const navigate = useNavigate();
  const { data: nfts, isLoading, error, refetch } = useUserNFTs();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
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
              onClick={() => refetch()}
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid place-items-center min-h-[60vh]">
              <div className="animate-pulse">Loading NFTs...</div>
            </div>
          ) : error ? (
            <div className="grid place-items-center min-h-[60vh] text-red-500">
              Error loading NFTs. Please try again.
            </div>
          ) : nfts && nfts.length > 0 ? (
            <NFTGrid nfts={nfts} />
          ) : (
            <EmptyNFTsState onExplore={() => navigate('/')} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyNFTs;