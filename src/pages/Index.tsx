import { Card } from "@/components/ui/card";
import { EventsList } from "@/components/events/EventsList";
import { AppHeader } from "@/components/layout/AppHeader";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-artence-navy dark:via-artence-dark dark:to-black transition-colors duration-300">
      <AppHeader />
      <div className="w-full px-2 pt-24 pb-8 animate-fade-in">
        <div className="container mx-auto">
          <div className="space-y-8">
            <EventsList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;