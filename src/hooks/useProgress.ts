import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProblemProgress {
    problem_id: string;
    status: "not_started" | "attempted" | "solved";
    code?: string;
    language?: string;
    solved_at?: string;
}

export function useProgress() {
    const { user } = useAuth();
    const [progress, setProgress] = useState<Record<string, ProblemProgress>>({});
    const [loading, setLoading] = useState(true);

    // Fetch user's progress from Supabase
    useEffect(() => {
        async function fetchProgress() {
            if (!user) {
                setProgress({});
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('problem_progress')
                    .select('*')
                    .eq('user_id', user.id);

                if (error) {
                    console.error('Error fetching progress:', error);
                    // Fallback to local storage if API fails
                    const stored = localStorage.getItem(`progress_${user.id}`);
                    if (stored) {
                        const items: ProblemProgress[] = JSON.parse(stored);
                        const progressMap: Record<string, ProblemProgress> = {};
                        items.forEach(item => {
                            progressMap[item.problem_id] = item;
                        });
                        setProgress(progressMap);
                    }
                    return;
                }

                if (data) {
                    const progressMap: Record<string, ProblemProgress> = {};
                    data.forEach((item: any) => {
                        progressMap[item.problem_id] = {
                            problem_id: item.problem_id,
                            status: item.status,
                            code: item.code,
                            language: item.language,
                            solved_at: item.solved_at
                        };
                    });
                    setProgress(progressMap);
                    // Update local storage to keep it in sync
                    localStorage.setItem(`progress_${user.id}`, JSON.stringify(Object.values(progressMap)));
                }
            } catch (err) {
                console.error("Unexpected error fetching progress:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchProgress();
    }, [user]);

    // Update progress for a problem
    const updateProgress = async (
        problemId: string,
        updates: Partial<Omit<ProblemProgress, "problem_id">>
    ) => {
        if (!user) return;

        const existingProgress = progress[problemId];
        const now = new Date().toISOString();

        const newProgress: ProblemProgress = {
            problem_id: problemId,
            status: updates.status || existingProgress?.status || "attempted",
            code: updates.code || existingProgress?.code,
            language: updates.language || existingProgress?.language,
            solved_at: updates.status === "solved" ? now : existingProgress?.solved_at,
        };

        // Optimistically update local state
        const newState = {
            ...progress,
            [problemId]: newProgress
        };
        setProgress(newState);
        localStorage.setItem(`progress_${user.id}`, JSON.stringify(Object.values(newState)));

        // Sync to Supabase
        try {
            const { error } = await supabase
                .from('problem_progress')
                .upsert({
                    user_id: user.id,
                    problem_id: problemId,
                    status: newProgress.status,
                    code: newProgress.code,
                    language: newProgress.language,
                    solved_at: newProgress.solved_at || null // Ensure null if undefined
                }, { onConflict: 'user_id, problem_id' });

            if (error) {
                console.error("Error syncing progress to Supabase:", error);
                toast.error("Failed to save progress to server");
            }
        } catch (err) {
            console.error("Unexpected error syncing progress:", err);
        }
    };

    const getProgress = (problemId: string): ProblemProgress | null => {
        return progress[problemId] || null;
    };

    const getSolvedCount = (): number => {
        return Object.values(progress).filter(p => p.status === "solved").length;
    };

    return { progress, loading, updateProgress, getProgress, getSolvedCount };
}
