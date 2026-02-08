-- Create diet type enum
CREATE TYPE public.diet_type AS ENUM ('veg', 'egg', 'non_veg');

-- Create food type enum
CREATE TYPE public.food_type AS ENUM ('mess_meal', 'home_food', 'outside_food', 'milk', 'protein_shake', 'fruit');

-- Create portion size enum
CREATE TYPE public.portion_size AS ENUM ('smaller', 'usual', 'heavier');

-- Create price band enum
CREATE TYPE public.price_band AS ENUM ('low', 'medium', 'high');

-- Create calorie status enum
CREATE TYPE public.calorie_status AS ENUM ('low', 'ok', 'high');

-- Create protein status enum
CREATE TYPE public.protein_status AS ENUM ('low', 'ok');

-- Create end of day status enum
CREATE TYPE public.end_of_day_status AS ENUM ('balanced', 'slightly_off');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  diet_type diet_type,
  optional_goal TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create food_logs table
CREATE TABLE public.food_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  food_type food_type NOT NULL,
  food_name TEXT,
  portion_size portion_size NOT NULL DEFAULT 'usual',
  calorie_min INTEGER NOT NULL,
  calorie_max INTEGER NOT NULL,
  protein_amount INTEGER NOT NULL DEFAULT 0,
  price_amount NUMERIC(10, 2),
  price_band price_band,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create daily_status table
CREATE TABLE public.daily_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  calorie_status calorie_status,
  protein_status protein_status,
  end_of_day_status end_of_day_status,
  total_calorie_min INTEGER DEFAULT 0,
  total_calorie_max INTEGER DEFAULT 0,
  total_protein INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create daily_spend table
CREATE TABLE public.daily_spend (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  outside_spend_total NUMERIC(10, 2) DEFAULT 0,
  addon_spend_total NUMERIC(10, 2) DEFAULT 0,
  total_spend NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_spend ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Food logs policies
CREATE POLICY "Users can view their own food logs"
ON public.food_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own food logs"
ON public.food_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own food logs"
ON public.food_logs FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own food logs"
ON public.food_logs FOR DELETE
USING (auth.uid() = user_id);

-- Daily status policies
CREATE POLICY "Users can view their own daily status"
ON public.daily_status FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily status"
ON public.daily_status FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily status"
ON public.daily_status FOR UPDATE
USING (auth.uid() = user_id);

-- Daily spend policies
CREATE POLICY "Users can view their own daily spend"
ON public.daily_spend FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily spend"
ON public.daily_spend FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily spend"
ON public.daily_spend FOR UPDATE
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_status_updated_at
BEFORE UPDATE ON public.daily_status
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_spend_updated_at
BEFORE UPDATE ON public.daily_spend
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();