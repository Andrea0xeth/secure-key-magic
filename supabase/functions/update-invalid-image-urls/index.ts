import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const placeholderImages = [
  'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
  'https://images.unsplash.com/photo-1518770660439-4636190af475',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
];

Deno.serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Fetching events with potentially invalid image URLs...');
    
    // Get all events
    const { data: events, error: fetchError } = await supabase
      .from('events')
      .select('id, image_url');

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Found ${events.length} events to check`);

    // Function to check if URL is valid
    const isValidUrl = (url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    // Filter events with invalid URLs
    const eventsToUpdate = events.filter(event => !isValidUrl(event.image_url));
    
    console.log(`Found ${eventsToUpdate.length} events with invalid URLs`);

    // Update each event with invalid URL
    for (const [index, event] of eventsToUpdate.entries()) {
      const newImageUrl = placeholderImages[index % placeholderImages.length];
      
      console.log(`Updating event ${event.id} with new image URL: ${newImageUrl}`);
      
      const { error: updateError } = await supabase
        .from('events')
        .update({ image_url: newImageUrl })
        .eq('id', event.id);

      if (updateError) {
        console.error(`Error updating event ${event.id}:`, updateError);
      }
    }

    return new Response(
      JSON.stringify({
        message: `Updated ${eventsToUpdate.length} events with new image URLs`,
        updatedEvents: eventsToUpdate.length
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});