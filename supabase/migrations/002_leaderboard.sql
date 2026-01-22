-- 1. Add score column to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0;

-- 2. Create function to update score on problem solve
CREATE OR REPLACE FUNCTION public.update_profile_score()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if status changed to 'solved'
  IF NEW.status = 'solved' AND (OLD.status IS NULL OR OLD.status != 'solved') THEN
    UPDATE public.profiles
    SET score = score + 10 -- Base score for any problem. Can be made dynamic later.
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create Trigger
DROP TRIGGER IF EXISTS on_problem_solved_update_score ON public.problem_progress;
CREATE TRIGGER on_problem_solved_update_score
  AFTER INSERT OR UPDATE ON public.problem_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_score();

-- 4. Enable Realtime for profiles table (if not already enabled globally, this ensures it works)
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
