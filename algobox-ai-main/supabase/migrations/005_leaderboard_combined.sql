-- ============================================
-- LEADERBOARD SETUP - Safe to run multiple times
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Add score column to profiles (if not exists)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0;

-- 2. Create/Replace the score update trigger function
CREATE OR REPLACE FUNCTION public.update_profile_score()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'solved' AND (OLD.status IS NULL OR OLD.status != 'solved') THEN
    UPDATE public.profiles
    SET score = score + 10
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Drop and recreate trigger
DROP TRIGGER IF EXISTS on_problem_solved_update_score ON public.problem_progress;
CREATE TRIGGER on_problem_solved_update_score
  AFTER INSERT OR UPDATE ON public.problem_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_score();

-- 4. Fix RLS to allow viewing all profiles (for leaderboard)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

-- 5. Enable Realtime for profiles (ignore error if already enabled)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- 6. RECALCULATE ALL SCORES from existing solved problems
WITH calculated_scores AS (
    SELECT 
        user_id, 
        COUNT(*) * 10 as correct_score
    FROM 
        public.problem_progress 
    WHERE 
        status = 'solved'
    GROUP BY 
        user_id
)
UPDATE 
    public.profiles p
SET 
    score = COALESCE(cs.correct_score, 0)
FROM 
    calculated_scores cs
WHERE 
    p.id = cs.user_id;

-- Done! Verify by running:
-- SELECT username, full_name, score FROM public.profiles ORDER BY score DESC;
