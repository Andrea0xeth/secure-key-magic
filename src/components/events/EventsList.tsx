import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EventCard } from "./EventCard";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const EventsList = () => {
  const { expanded } = useSidebar();
  const { data: events, isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      console.log("Fetching events from Supabase...");
      
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: false }); // Modificato qui per mostrare prima gli eventi più recenti

      if (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events");
        throw error;
      }

      console.log("Successfully fetched events:", data);
      return data;
    },
    // Refresh data every minute
    refetchInterval: 60000,
  });

  const gridClassName = cn(
    "grid gap-8 px-8 transition-all duration-500",
    expanded
      ? "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
  );

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-red-500">Failed to load events. Please try again later.</p>
      </div>
    );
  }

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

  if (!events?.length) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-gray-500">No events found.</p>
      </div>
    );
  }

  return (
    <div className={gridClassName}>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};