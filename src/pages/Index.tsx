import { Card } from "@/components/ui/card";
import { EventsList } from "@/components/events/EventsList";
import { AppHeader } from "@/components/layout/AppHeader";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-radial from-artence-dark via-artence-navy to-black transition-colors duration-300">
      <AppHeader />
      <div className="w-full px-2 pt-24 pb-8 animate-fade-in">
        <div className="container mx-auto">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">
                Hendrick's Gin Events
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
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