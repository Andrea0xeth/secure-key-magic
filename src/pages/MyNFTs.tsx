import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ImageIcon } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";

const MyNFTs = () => {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-artence-navy dark:via-artence-dark dark:to-black transition-colors duration-300">
      <AppHeader />
      <div className="w-full px-2 pt-24 pb-8 animate-fade-in">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-artence-navy dark:text-white">
            My NFTs
          </h1>
          <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <ImageIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No NFTs Found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md">
              You don't have any NFTs in your collection yet. Once you acquire NFTs, they will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyNFTs;