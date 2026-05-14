-- Recalculate scores for all users based on their actual solved problems
-- This fixes the issue where existing users had 0 score despite having solved problems before the leaderboard was added.

WITH calculated_scores AS (
    SELECT 
        user_id, 
        COUNT(*) * 10 as correct_score -- Assuming 10 XP per problem
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
    score = cs.correct_score
FROM 
    calculated_scores cs
WHERE 
    p.id = cs.user_id;
