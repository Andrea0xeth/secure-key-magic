import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ImageIcon, RefreshCcw } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

interface NFTEvent {
  events: {
    title: string;
    description: string;
    image_url: string;
    date: string;
    location: string;
    nft_asset_id: string;
  };
  asset_id: string;
  minted_at: string;
}

const MyNFTs = () => {
  const navigate = useNavigate();

  const fetchUserNFTs = async () => {
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
    return data as NFTEvent[];
  };

  const { data: nfts, isLoading, error, refetch } = useQuery({
    queryKey: ['userNFTs'],
    queryFn: fetchUserNFTs,
  });

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nfts.map((nft) => (
                <Card key={nft.asset_id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={nft.events.image_url} 
                      alt={nft.events.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardHeader className="space-y-1">
                    <h3 className="text-xl font-semibold">{nft.events.title}</h3>
                    <p className="text-sm text-muted-foreground">Asset ID: {nft.asset_id}</p>
                    <p className="text-sm text-muted-foreground">
                      Minted: {new Date(nft.minted_at).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{nft.events.description}</p>
                    <div className="flex flex-col gap-1 text-sm">
                      <p>📍 {nft.events.location}</p>
                      <p>📅 {new Date(nft.events.date).toLocaleDateString()}</p>
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