-- Enable PostGIS extension for geospatial functionality
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase Auth)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone_number TEXT,
    home_address TEXT,
    location GEOMETRY(POINT, 4326), -- PostGIS point for home location
    is_responder BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alerts table
CREATE TABLE public.alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    location GEOMETRY(POINT, 4326) NOT NULL, -- PostGIS point for alert location
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'false_alarm')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Responders table (tracks who is responding to alerts)
CREATE TABLE public.responders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    alert_id UUID REFERENCES public.alerts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'en_route' CHECK (status IN ('en_route', 'on_scene', 'completed')),
    location GEOMETRY(POINT, 4326), -- Current location of responder
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(alert_id, user_id)
);

-- Chat messages table
CREATE TABLE public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    alert_id UUID REFERENCES public.alerts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_location ON public.users USING GIST (location);
CREATE INDEX idx_alerts_location ON public.alerts USING GIST (location);
CREATE INDEX idx_alerts_status ON public.alerts (status);
CREATE INDEX idx_alerts_created_at ON public.alerts (created_at DESC);
CREATE INDEX idx_responders_alert_id ON public.responders (alert_id);
CREATE INDEX idx_responders_location ON public.responders USING GIST (location);
CREATE INDEX idx_chat_messages_alert_id ON public.chat_messages (alert_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages (created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON public.alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_responders_updated_at BEFORE UPDATE ON public.responders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Alerts policies (all users can view all alerts for community safety)
CREATE POLICY "All users can view all alerts" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Users can create alerts" ON public.alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Alert creators can update their alerts" ON public.alerts FOR UPDATE USING (auth.uid() = user_id);

-- Responders policies
CREATE POLICY "All users can view responders" ON public.responders FOR SELECT USING (true);
CREATE POLICY "Users can add themselves as responders" ON public.responders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Responders can update their status" ON public.responders FOR UPDATE USING (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "All users can view chat messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Users can send chat messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to find nearby users (within 2km radius)
CREATE OR REPLACE FUNCTION get_nearby_users(alert_location GEOMETRY, radius_meters INTEGER DEFAULT 2000)
RETURNS TABLE (
    user_id UUID,
    full_name TEXT,
    email TEXT,
    phone_number TEXT,
    distance_meters DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.full_name,
        u.email,
        u.phone_number,
        ST_Distance(u.location::geography, alert_location::geography) as distance_meters
    FROM public.users u
    WHERE u.location IS NOT NULL
    AND ST_DWithin(u.location::geography, alert_location::geography, radius_meters)
    ORDER BY distance_meters;
END;
$$ LANGUAGE plpgsql; 