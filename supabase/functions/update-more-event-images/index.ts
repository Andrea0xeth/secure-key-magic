import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Define the new image updates
    const imageUpdates = [
      {
        title: "Hendrick's Lunar Night",
        image_url: "public/lovable-uploads/1b48e3e8-e0f0-4b16-b68e-c4bd8f5bc1ef.png"
      },
      {
        title: "Amazonia Jungle Experience",
        image_url: "public/lovable-uploads/e1abf270-beff-45a1-a07d-24856449f160.png"
      },
      {
        title: "Orbium Masterclass",
        image_url: "public/lovable-uploads/9cdc7a5c-f8df-4207-91a3-0ad6c30e5a53.png"
      },
      {
        title: "Neptunia Sea Adventure",
        image_url: "public/lovable-uploads/dce86cf9-d581-43d8-9916-eb582d166938.png"
      },
      {
        title: "Midsummer Solstice Party",
        image_url: "public/lovable-uploads/fee172f3-7d03-4dbe-b1d4-4d12e310dc55.png"
      }
    ]

    console.log('Starting additional image updates...')

    // Update each event with its corresponding image
    for (const update of imageUpdates) {
      const { error } = await supabase
        .from('events')
        .update({ image_url: update.image_url })
        .eq('title', update.title)

      if (error) {
        console.error(`Error updating ${update.title}:`, error)
        throw error
      }
      console.log(`Successfully updated image for ${update.title}`)
    }

    return new Response(
      JSON.stringify({ message: 'Additional images updated successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})