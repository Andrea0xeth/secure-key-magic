// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://plyybasafokznfgjfxef.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBseXliYXNhZm9rem5mZ2pmeGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4OTIxOTAsImV4cCI6MjA0ODQ2ODE5MH0.wanv6UqOtCTgZAbck9nBtpzP8zOw9diTCjYuP5gwOE8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);