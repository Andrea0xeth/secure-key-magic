
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  date: z.string().min(1, "Date is required"),
  image: z.instanceof(File).optional(),
});

export const EventForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      date: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      
      // Check if we can connect to Supabase
      const { error: pingError } = await supabase.from("events").select("id").limit(1);
      
      if (pingError) {
        console.error("Cannot connect to Supabase:", pingError);
        setIsOfflineMode(true);
        toast.error("Database connection unavailable", {
          description: "Event creation is disabled while offline. Please try again later."
        });
        return;
      }
      
      let image_url = "";
      
      if (values.image) {
        try {
          const fileExt = values.image.name.split(".").pop();
          const filePath = `${Math.random()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from("events")
            .upload(filePath, values.image);

          if (uploadError) {
            throw uploadError;
          }

          const { data: { publicUrl } } = supabase.storage
            .from("events")
            .getPublicUrl(filePath);
            
          image_url = publicUrl;
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.warning("Could not upload image", {
            description: "Event will be created with a placeholder image."
          });
          // Use a placeholder image if upload fails
          image_url = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";
        }
      }

      const { error } = await supabase.from("events").insert({
        title: values.title,
        description: values.description,
        location: values.location,
        date: new Date(values.date).toISOString(),
        image_url: image_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      });

      if (error) throw error;

      toast.success("Event created successfully!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      form.reset();
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Please try again.", {
        description: error.message || "An unknown error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div className={isOfflineMode ? "opacity-50 pointer-events-none" : ""}>
          <FormField
            control={form.control}
            name="image"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Event Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onChange(file);
                    }}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter event title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter event location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter event description" 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {isOfflineMode && (
          <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                  Offline Mode
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>
                    Database connection is currently unavailable. Event creation is disabled.
                    Please try again when connectivity is restored.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <Button 
          type="submit" 
          disabled={isLoading || isOfflineMode}
          className="relative"
        >
          {isLoading ? "Creating..." : "Create Event"}
        </Button>
      </form>
    </Form>
  );
};
