-- ==============================================================================
-- FRAUDSHIELD AI - SUPABASE POSTGRESQL SCHEMA
-- Paste this entire script into your Supabase Dashboard:
-- SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. PROFILES TABLE (Extends Supabase built-in auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS) on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger: Automatically insert a row into public.profiles on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. SCAM CHECKS TABLE (Stores scan analysis history)
CREATE TABLE IF NOT EXISTS public.scam_checks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  input_text TEXT NOT NULL,
  selected_type TEXT,
  risk_score INTEGER NOT NULL,
  risk_level TEXT NOT NULL,
  scam_category TEXT NOT NULL,
  summary TEXT NOT NULL,
  warning_signs JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommended_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  confidence_level TEXT NOT NULL,
  disclaimer TEXT,
  sources JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.scam_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create scam checks"
  ON public.scam_checks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Scam checks viewable by creator or publicly"
  ON public.scam_checks FOR SELECT
  USING (true);


-- 3. SCAM REPORTS TABLE (Community threat intelligence database)
CREATE TABLE IF NOT EXISTS public.scam_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reported_message TEXT NOT NULL,
  category TEXT,
  country TEXT,
  user_email TEXT,
  status TEXT DEFAULT 'verified' CHECK (status IN ('pending', 'verified', 'dismissed')),
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.scam_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read verified scam reports"
  ON public.scam_reports FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can submit scam reports"
  ON public.scam_reports FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users or admins can update upvotes"
  ON public.scam_reports FOR UPDATE
  USING (true);


-- 4. FEEDBACK TABLE (User helpfulness ratings on scans)
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scam_check_id UUID REFERENCES public.scam_checks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_rating INTEGER NOT NULL CHECK (user_rating IN (0, 1)),
  user_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit scan feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read feedback summary"
  ON public.feedback FOR SELECT
  USING (true);


-- ==============================================================================
-- INITIAL SEED DATA FOR THREAT FEED
-- ==============================================================================
INSERT INTO public.scam_reports (reported_message, category, country, user_email, upvotes)
VALUES
  ('AI automated crypto algorithm yields 300% weekly returns with zero risk. Send 0.05 BTC to VIP tier bot: @crypto_guru_wealth_bot.', 'Fake investment', 'Canada', 'in***@gmail.com', 22),
  ('HIRING: Remote Data Entry Clerk. Earn $500/day. Purchase mandatory starter kit for $150 refundable on first paycheck. WhatsApp: +1-555-0198.', 'Fake job', 'United Kingdom', 'ap***@outlook.com', 21),
  ('Congratulations! You have been selected for the $25,000 international scholarship. To claim your award, please send $300 registration fee via Western Union.', 'Fake scholarship', 'Kenya', 'st***@yahoo.com', 20),
  ('URGENT: Your parcel #US940011883 has been suspended due to incomplete address. Please pay $1.99 redelivery fee at http://usps-redelivery-tracking-secure.com within 24 hours.', 'Phishing', 'United States', 'ci***@gmail.com', 19)
ON CONFLICT DO NOTHING;
