import { Sidebar } from "@/components/ui/sidebar";

export const LoadingState = () => {
  return (
    <Sidebar className="border-l">
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    </Sidebar>
  );
};