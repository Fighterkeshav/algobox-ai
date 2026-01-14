import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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

    // Fetch user's progress
    useEffect(() => {
        if (!user) {
            setProgress({});
            setLoading(false);
            return;
        }

        const fetchProgress = async () => {
            const { data, error } = await supabase
                .from("problem_progress")
                .select("*")
                .eq("user_id", user.id);

            if (!error && data) {
                const progressMap: Record<string, ProblemProgress> = {};
                data.forEach((item: any) => {
                    progressMap[item.problem_id] = {
                        problem_id: item.problem_id,
                        status: item.status,
                        code: item.code,
                        language: item.language,
                        solved_at: item.solved_at,
                    };
                });
                setProgress(progressMap);
            }
            setLoading(false);
        };

        fetchProgress();
    }, [user]);

    // Update progress for a problem
    const updateProgress = async (
        problemId: string,
        updates: Partial<Omit<ProblemProgress, "problem_id">>
    ) => {
        if (!user) return;

        const existingProgress = progress[problemId];

        if (existingProgress) {
            // Update existing
            await supabase
                .from("problem_progress")
                .update({
                    ...updates,
                    ...(updates.status === "solved" && !existingProgress.solved_at
                        ? { solved_at: new Date().toISOString() }
                        : {}),
                })
                .eq("user_id", user.id)
                .eq("problem_id", problemId);
        } else {
            // Insert new
            await supabase.from("problem_progress").insert({
                user_id: user.id,
                problem_id: problemId,
                status: updates.status || "attempted",
                code: updates.code,
                language: updates.language,
                ...(updates.status === "solved" ? { solved_at: new Date().toISOString() } : {}),
            });
        }

        // Update local state
        setProgress((prev) => ({
            ...prev,
            [problemId]: {
                problem_id: problemId,
                status: updates.status || existingProgress?.status || "attempted",
                code: updates.code || existingProgress?.code,
                language: updates.language || existingProgress?.language,
                solved_at:
                    updates.status === "solved"
                        ? new Date().toISOString()
                        : existingProgress?.solved_at,
            },
        }));
    };

    const getProgress = (problemId: string): ProblemProgress | null => {
        return progress[problemId] || null;
    };

    const getSolvedCount = (): number => {
        return Object.values(progress).filter((p) => p.status === "solved").length;
    };

    return { progress, loading, updateProgress, getProgress, getSolvedCount };
}
