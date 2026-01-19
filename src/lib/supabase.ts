import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rzhpydydecvakrtwwxfl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6aHB5ZHlkZWN2YWtydHd3eGZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyOTQxNjMsImV4cCI6MjA4Mjg3MDE2M30.8YfEQMaNUHZe0vZoAjVlJf7SwTRs4rjPTdR128ZXOks';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
