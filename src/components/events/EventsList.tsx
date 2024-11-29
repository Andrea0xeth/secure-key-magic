import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EventCard } from "./EventCard";

export const EventsList = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-[400px] bg-artence-light/10 dark:bg-artence-navy/50 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {events?.map((event) => (
        <div 
          key={event.id} 
          className="flex-grow min-w-[280px] max-w-[400px] basis-[calc(33.333%-16px)]"
        >
          <EventCard event={event} />
        </div>
      ))}
    </div>
  );
};