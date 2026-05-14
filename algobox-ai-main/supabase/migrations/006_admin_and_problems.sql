-- Create Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    email TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Protect Admin Users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins are viewable by everyone" ON public.admin_users
    FOR SELECT USING (true);

-- Only primary admin can manage admins (or anyone already an admin, depending on strictness)
CREATE POLICY "Primary admin can insert" ON public.admin_users
    FOR INSERT WITH CHECK (
      (auth.jwt() ->> 'email') = 'fighterkeshav7@gmail.com'
    );
    
CREATE POLICY "Primary admin can delete" ON public.admin_users
    FOR DELETE USING (
      (auth.jwt() ->> 'email') = 'fighterkeshav7@gmail.com'
    );

-- Create Custom Problems Table
CREATE TABLE IF NOT EXISTS public.custom_problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    starter_code JSONB NOT NULL DEFAULT '{}'::jsonb,
    solution_structure TEXT NOT NULL,
    test_cases JSONB NOT NULL DEFAULT '[]'::jsonb,
    hints TEXT[] NOT NULL DEFAULT '{}',
    constraints TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Protect Custom Problems
ALTER TABLE public.custom_problems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Custom problems are viewable by everyone" ON public.custom_problems
    FOR SELECT USING (true);

-- Only authenticated admins can insert/update/delete problems
CREATE POLICY "Admins can insert problems" ON public.custom_problems
    FOR INSERT WITH CHECK (
        (auth.jwt() ->> 'email') IN (SELECT email FROM public.admin_users) OR
        (auth.jwt() ->> 'email') = 'fighterkeshav7@gmail.com'
    );

CREATE POLICY "Admins can update problems" ON public.custom_problems
    FOR UPDATE USING (
        (auth.jwt() ->> 'email') IN (SELECT email FROM public.admin_users) OR
        (auth.jwt() ->> 'email') = 'fighterkeshav7@gmail.com'
    ) WITH CHECK (
        (auth.jwt() ->> 'email') IN (SELECT email FROM public.admin_users) OR
        (auth.jwt() ->> 'email') = 'fighterkeshav7@gmail.com'
    );

CREATE POLICY "Admins can delete problems" ON public.custom_problems
    FOR DELETE USING (
        (auth.jwt() ->> 'email') IN (SELECT email FROM public.admin_users) OR
        (auth.jwt() ->> 'email') = 'fighterkeshav7@gmail.com'
    );


-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_custom_problems_modtime
    BEFORE UPDATE ON public.custom_problems
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();


-- Create Feature Flags Table (Single row implementation or key-value)
-- We will use a key-value style for easy expansion
CREATE TABLE IF NOT EXISTS public.feature_flags (
    id TEXT PRIMARY KEY,
    value BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert defaults
INSERT INTO public.feature_flags (id, value) VALUES
    ('improveWebExperience', true),
    ('practiceBetaEnabled', true),
    ('maintenanceMode', false)
ON CONFLICT (id) DO NOTHING;

-- Protect Feature Flags
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Feature flags are viewable by everyone" ON public.feature_flags
    FOR SELECT USING (true);

CREATE POLICY "Admins can update feature flags" ON public.feature_flags
    FOR UPDATE USING (
        (auth.jwt() ->> 'email') IN (SELECT email FROM public.admin_users) OR
        (auth.jwt() ->> 'email') = 'fighterkeshav7@gmail.com'
    ) WITH CHECK (
        (auth.jwt() ->> 'email') IN (SELECT email FROM public.admin_users) OR
        (auth.jwt() ->> 'email') = 'fighterkeshav7@gmail.com'
    );
