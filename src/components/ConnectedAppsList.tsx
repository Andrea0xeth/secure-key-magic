import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { disconnectWalletConnect } from "@/lib/walletConnect";
import { useToast } from "@/components/ui/use-toast";

interface ConnectedApp {
  name: string;
  topic: string;
}

export const ConnectedAppsList = () => {
  const [connectedApps, setConnectedApps] = useState<ConnectedApp[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchConnectedApps = async () => {
      try {
        // Get the SignClient instance
        const SignClient = (await import('@walletconnect/sign-client')).default;
        const client = await SignClient.init({
          projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
        });

        // Get all active sessions
        const sessions = client.session.values;
        const apps = sessions.map(session => ({
          name: session.peer.metadata.name,
          topic: session.topic
        }));

        setConnectedApps(apps);
      } catch (error) {
        console.error("Error fetching connected apps:", error);
      }
    };

    fetchConnectedApps();
  }, []);

  const handleDisconnect = async (topic: string) => {
    try {
      const SignClient = (await import('@walletconnect/sign-client')).default;
      const client = await SignClient.init({
        projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
      });

      await client.disconnect({
        topic,
        reason: {
          code: 6000,
          message: "User disconnected"
        }
      });

      setConnectedApps(prev => prev.filter(app => app.topic !== topic));
      
      toast({
        title: "Disconnected",
        description: "Successfully disconnected from the dApp",
      });
    } catch (error) {
      console.error("Error disconnecting:", error);
      toast({
        title: "Error",
        description: "Failed to disconnect from the dApp",
        variant: "destructive",
      });
    }
  };

  if (connectedApps.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center">
        No connected dApps
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Connected dApps</h3>
      <div className="space-y-2">
        {connectedApps.map((app) => (
          <div
            key={app.topic}
            className="flex items-center justify-between p-2 rounded-lg border bg-card"
          >
            <span className="text-sm">{app.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDisconnect(app.topic)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};