import { Card } from "@/components/ui/card";
import { EventsList } from "@/components/events/EventsList";
import { Header } from "@/components/layout/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-artence-navy dark:to-gray-900 transition-colors duration-300">
      <div className="w-full px-2 pt-16 pb-8 animate-fade-in">
        <div className="container mx-auto">
          <Header />
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-artence-navy dark:text-white mb-4">
                Hendrick's Gin Events
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Discover our peculiar gatherings and collect unique NFTs from each extraordinary experience
              </p>
            </div>
            <EventsList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;