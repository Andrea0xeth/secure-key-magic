import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EventCard } from "./EventCard";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export const EventsList = () => {
  const { expanded } = useSidebar();
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