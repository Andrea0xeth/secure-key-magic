import { Outlet } from "react-router-dom";
import { AppHeader } from "./layout/AppHeader";
import { WalletSidebar } from "./wallet/WalletSidebar";

export const AppContent = () => {
  return (
    <div className="min-h-screen w-full">
      <AppHeader />
      <main className="min-h-screen w-full bg-gradient-radial from-artence-dark via-artence-navy to-black">
        <Outlet />
      </main>
      <WalletSidebar />
    </div>
  );
};