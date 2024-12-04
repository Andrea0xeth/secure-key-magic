import { Sidebar } from "@/components/ui/sidebar";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useSidebar } from "@/components/ui/sidebar";
import { UserProfileSection } from "../UserProfileSection";
import { WalletTabContent } from "./sidebar/WalletTabContent";
import { TabNavigation } from "./sidebar/TabNavigation";
import { AuthSection } from "./sidebar/AuthSection";
import { LoadingState } from "./sidebar/LoadingState";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { useWalletAuth } from "@/hooks/useWalletAuth";

export function WalletSidebar() {
  const { setExpanded } = useSidebar();
  const {
    authResult,
    session,
    isLoading,
    handleRegister,
    handleAuthenticate,
    handleLogout
  } = useWalletAuth();

  if (isLoading) {
    return <LoadingState />;
  }

  if (!session) {
    return (
      <Sidebar className="border-l">
        <AuthSection onClose={() => setExpanded(false)} />
      </Sidebar>
    );
  }

  return (
    <Sidebar className="border-l">
      <div className="flex flex-col h-full">
        <SidebarHeader onClose={() => setExpanded(false)} />
        <Tabs defaultValue="wallet" className="w-full mt-16">
          <TabNavigation onLogout={handleLogout} />
          <WalletTabContent
            authResult={authResult}
            onRegister={handleRegister}
            onAuthenticate={handleAuthenticate}
          />
          <TabsContent value="settings" className="p-6 mt-0">
            <UserProfileSection />
          </TabsContent>
        </Tabs>
      </div>
    </Sidebar>
  );
}