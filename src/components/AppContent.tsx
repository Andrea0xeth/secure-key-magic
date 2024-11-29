import { Outlet } from "react-router-dom";

export const AppContent = () => {
  return (
    <main className="min-h-screen w-full bg-transparent">
      <Outlet />
    </main>
  );
};