import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
      <div className="w-full px-2 pt-24 pb-8 animate-fade-in">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-artence-navy dark:text-white">
            My NFTs
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* NFT content will be added here in future updates */}
            <p className="text-gray-600 dark:text-gray-300">
              Your NFT collection will appear here soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyNFTs;