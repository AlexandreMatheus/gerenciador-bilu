import { createClient } from '@supabase/supabase-js';

// Substitua pelos valores do seu projeto
const supabaseUrl = 'https://xlcchvfnpvhltgugtgmu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsY2NodmZucHZobHRndWd0Z211Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1NDkzOTEsImV4cCI6MjA0NzEyNTM5MX0.naBIwoEtvYQoflqvAmkgcWqa8_Yk_rDBy5peecqfb_M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)