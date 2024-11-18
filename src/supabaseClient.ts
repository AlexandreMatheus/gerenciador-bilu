import { createClient } from '@supabase/supabase-js';

// Substitua pelos valores do seu projeto
const supabaseUrl = 'https://fjvuonsifrxlrflwufde.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqdnVvbnNpZnJ4bHJmbHd1ZmRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4NTk2NjIsImV4cCI6MjA0NzQzNTY2Mn0.UCBDLQjnFqD7SE5wnHgRKgoB0PxbQSRXjkyAHqRKs9c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)