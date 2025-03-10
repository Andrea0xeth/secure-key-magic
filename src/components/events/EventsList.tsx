
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EventCard } from "./EventCard";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { mockEvents } from "@/lib/mockData";

export const EventsList = () => {
  const { expanded } = useSidebar();
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      try {
        console.log("Attempting to fetch events from Supabase...");
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("date", { ascending: true });

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        
        console.log("Successfully fetched events:", data);
        return data;
      } catch (error) {
        console.error("Failed to fetch events from Supabase:", error);
        
        // Show toast notification
        toast.error("Could not connect to the database. Using local data instead.", {
          description: "The application is running in offline mode with sample data."
        });
        
        // Return mock data as fallback
        return mockEvents;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const gridClassName = cn(
    "grid gap-8 px-8 transition-all duration-500",
    expanded
      ? "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
  );

  if (isLoading) {
    return (
      <div className={gridClassName}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={gridClassName}>
      {events?.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};
