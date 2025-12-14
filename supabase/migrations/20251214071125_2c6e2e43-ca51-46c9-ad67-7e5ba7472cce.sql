-- Create todos table
CREATE TABLE public.todos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  priority TEXT NOT NULL DEFAULT 'medium',
  category TEXT NOT NULL DEFAULT 'personal',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  due_date TIMESTAMP WITH TIME ZONE,
  subtasks JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Enable Row Level Security
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (no auth required for now)
CREATE POLICY "Allow public read access" ON public.todos FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.todos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.todos FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.todos FOR DELETE USING (true);