-- Create table for storing booth algorithm operation history
CREATE TABLE public.booth_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  multiplicand TEXT NOT NULL,
  multiplier TEXT NOT NULL,
  result TEXT NOT NULL,
  steps JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.booth_history ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (public access)
CREATE POLICY "Anyone can insert booth history" 
ON public.booth_history 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow anyone to view booth history
CREATE POLICY "Anyone can view booth history" 
ON public.booth_history 
FOR SELECT 
USING (true);

-- Create policy to allow anyone to delete booth history
CREATE POLICY "Anyone can delete booth history" 
ON public.booth_history 
FOR DELETE 
USING (true);

-- Create index for faster queries on created_at
CREATE INDEX idx_booth_history_created_at ON public.booth_history(created_at DESC);