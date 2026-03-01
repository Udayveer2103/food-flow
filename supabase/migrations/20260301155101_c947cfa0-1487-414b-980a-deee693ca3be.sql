
-- Create daily_state table for experiential reflection
CREATE TABLE public.daily_state (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  state TEXT NOT NULL CHECK (state IN ('light', 'neutral', 'heavy')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.daily_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own daily state"
ON public.daily_state FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily state"
ON public.daily_state FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily state"
ON public.daily_state FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_daily_state_updated_at
BEFORE UPDATE ON public.daily_state
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
