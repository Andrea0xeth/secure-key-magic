import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { disconnectWalletConnect } from "@/lib/walletConnect/connection";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { initSignClient } from "@/lib/walletConnect/client";

interface ConnectedApp {
  name: string;
  topic: string;
}

export const ConnectedAppsList = () => {
  const { toast } = useToast();

  const { data: connectedApp, refetch } = useQuery({
    queryKey: ['connectedApps'],
    queryFn: async () => {
      const client = await initSignClient();
      const sessions = client.session.values;
      // Only return the most recent session if it exists
      const latestSession = sessions[sessions.length - 1];
      return latestSession ? {
        name: latestSession.peer.metadata.name,
        topic: latestSession.topic
      } : null;
    },
    refetchInterval: 5000,
  });

  const handleDisconnect = async (topic: string) => {
    try {
      await disconnectWalletConnect();
      refetch();
      toast({
        title: "Disconnected",
        description: "Successfully disconnected from dApp",
      });
    } catch (error) {
      console.error("Error disconnecting:", error);
      toast({
        title: "Error",
        description: "Failed to disconnect from dApp",
        variant: "destructive",
      });
    }
  };

  if (!connectedApp) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400 text-center transition-colors duration-300">
        No connected dApps
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium dark:text-white transition-colors duration-300">Connected dApp</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
          <span className="text-sm dark:text-white">{connectedApp.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDisconnect(connectedApp.topic)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-300"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};