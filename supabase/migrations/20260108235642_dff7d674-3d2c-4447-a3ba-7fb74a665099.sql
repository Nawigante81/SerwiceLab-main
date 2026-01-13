-- Create enums for repair status and device types
CREATE TYPE public.repair_status AS ENUM (
  'pending',
  'received', 
  'diagnosing',
  'waiting_estimate',
  'in_repair',
  'completed',
  'shipped',
  'delivered'
);

CREATE TYPE public.device_type AS ENUM ('laptop', 'pc', 'other');

CREATE TYPE public.shipping_method AS ENUM ('inpost', 'dpd');

CREATE TYPE public.estimate_status AS ENUM ('pending', 'accepted', 'rejected');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  street TEXT,
  city TEXT,
  postal_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create repairs table
CREATE TABLE public.repairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  device_type device_type NOT NULL,
  device_brand TEXT,
  device_model TEXT,
  problem_description TEXT NOT NULL,
  status repair_status NOT NULL DEFAULT 'pending',
  tracking_number_outbound TEXT,
  tracking_number_return TEXT,
  shipping_method shipping_method,
  paczkomat_id TEXT,
  attachments TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.repairs ENABLE ROW LEVEL SECURITY;

-- Create cost_estimates table
CREATE TABLE public.cost_estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repair_id UUID NOT NULL REFERENCES public.repairs(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  labor_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  parts_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  status estimate_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  accepted_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cost_estimates ENABLE ROW LEVEL SECURITY;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_repairs_updated_at
  BEFORE UPDATE ON public.repairs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cost_estimates_updated_at
  BEFORE UPDATE ON public.cost_estimates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for repairs
CREATE POLICY "Users can view own repairs"
  ON public.repairs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own repairs"
  ON public.repairs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own repairs"
  ON public.repairs FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for cost_estimates
CREATE POLICY "Users can view estimates for own repairs"
  ON public.cost_estimates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.repairs
      WHERE repairs.id = cost_estimates.repair_id
      AND repairs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update estimates for own repairs"
  ON public.cost_estimates FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.repairs
      WHERE repairs.id = cost_estimates.repair_id
      AND repairs.user_id = auth.uid()
    )
  );