import { Wallet, Settings, LogOut } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface TabNavigationProps {
  onLogout: () => Promise<void>;
}

export const TabNavigation = ({ onLogout }: TabNavigationProps) => {
  return (
    <div className="border-b">
      <TabsList className="w-full justify-between bg-transparent border-b p-0">
        <TabsTrigger 
          value="wallet"
          className="flex-1 py-3 px-4 transition-all duration-200 data-[state=active]:bg-artence-light dark:data-[state=active]:bg-artence-navy data-[state=active]:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <Wallet className="h-5 w-5" />
        </TabsTrigger>
        <TabsTrigger 
          value="settings"
          className="flex-1 py-3 px-4 transition-all duration-200 data-[state=active]:bg-artence-light dark:data-[state=active]:bg-artence-navy data-[state=active]:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <Settings className="h-5 w-5" />
        </TabsTrigger>
        <Button
          variant="ghost"
          size="icon"
          onClick={onLogout}
          className="flex-1 py-3 px-4 h-auto rounded-none hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-destructive transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </TabsList>
    </div>
  );
};