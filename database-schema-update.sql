-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Add new fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS responder_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS emergency_contacts jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{
  "alerts_radius_km": 5,
  "push_notifications": true,
  "sms_notifications": false,
  "email_notifications": true
}'::jsonb;

-- Add new fields to alerts table
ALTER TABLE public.alerts
ADD COLUMN IF NOT EXISTS type text DEFAULT 'emergency',
ADD COLUMN IF NOT EXISTS media_urls text[] DEFAULT ARRAY[]::text[],
ADD COLUMN IF NOT EXISTS resolved_at timestamptz,
ADD COLUMN IF NOT EXISTS resolved_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS resolution_notes text,
ADD COLUMN IF NOT EXISTS responders_notified UUID[] DEFAULT ARRAY[]::UUID[],
ADD COLUMN IF NOT EXISTS responders_acknowledged UUID[] DEFAULT ARRAY[]::UUID[];

-- Add new fields to responders table
ALTER TABLE public.responders
ADD COLUMN IF NOT EXISTS eta_minutes integer,
ADD COLUMN IF NOT EXISTS notes text;

-- Update alerts RLS policy to include radius-based filtering
DROP POLICY IF EXISTS "All users can view all alerts" ON public.alerts;
DROP POLICY IF EXISTS "Users can view nearby alerts" ON public.alerts;
CREATE POLICY "Users can view nearby alerts"
ON public.alerts
FOR SELECT
USING (
  ST_DWithin(
    location::geography,
    (SELECT location::geography FROM public.users WHERE id = auth.uid()),
    (SELECT (notification_preferences->>'alerts_radius_km')::float * 1000 
     FROM public.users 
     WHERE id = auth.uid()
    )
  )
  OR user_id = auth.uid()
  OR auth.uid() = ANY(responders_notified)
);

-- Add policy for verified responders
CREATE POLICY "Only verified responders can respond"
ON public.responders
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND is_responder = true 
    AND responder_verified = true
  )
);

-- Create function to update alert status
CREATE OR REPLACE FUNCTION update_alert_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
    NEW.resolved_at = NOW();
    NEW.resolved_by = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for alert status updates
DROP TRIGGER IF EXISTS alert_status_update ON public.alerts;
CREATE TRIGGER alert_status_update
  BEFORE UPDATE ON public.alerts
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION update_alert_status();

-- Add index for verified responders
CREATE INDEX IF NOT EXISTS idx_users_verified_responders 
ON public.users (is_responder) 
WHERE is_responder = true AND responder_verified = true;

-- Add RLS policies for users table
DROP POLICY IF EXISTS "Users can manage their own profiles" ON public.users;
CREATE POLICY "Users can manage their own profiles"
ON public.users
FOR ALL
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow users to create their initial profile
DROP POLICY IF EXISTS "Users can create their initial profile" ON public.users;
CREATE POLICY "Users can create their initial profile"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = id 
    AND NOT EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid()
    )
);

-- Allow users to read basic info of other users
DROP POLICY IF EXISTS "Users can read basic info" ON public.users;
CREATE POLICY "Users can read basic info"
ON public.users
FOR SELECT
USING (true);
