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

    // Define the image URLs and their corresponding event titles
    const imageUpdates = [
      {
        title: "Hendrick's Absinthe Launch Party",
        image_url: "https://black-conceptual-hamster-950.mypinata.cloud/files/bafybeigbv34uxjhyoxx73ri5akwjmtfzoechboaj5cqv7eir7532rcu5sy?X-Algorithm=PINATA1&X-Date=1733501310&X-Expires=30&X-Method=GET&X-Signature=358ceabc636d21248764a08189db4e4ea514a4280918cfdd6153af8b28dfa81b"
      },
      {
        title: "Flora Adora Garden Experience",
        image_url: "public/lovable-uploads/99353e95-f24d-4a59-87c2-cd232c0815a2.png"
      },
      {
        title: "Grand Cabaret Night",
        image_url: "public/lovable-uploads/54ffea6b-0097-4545-b86c-70c4de522a47.png"
      },
      {
        title: "Original Gin Tasting Experience",
        image_url: "public/lovable-uploads/80a02a0f-7b1b-44d1-94cf-755c8d923c41.png"
      },
      {
        title: "Holiday Celebration",
        image_url: "public/lovable-uploads/646a1909-6d0b-4337-9a40-6ad6bec3f57d.png"
      }
    ]

    console.log('Starting image updates...')

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
      JSON.stringify({ message: 'Images updated successfully' }),
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