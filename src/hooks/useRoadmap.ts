import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface RoadmapItemProgress {
    topic_id: string;
    completed: boolean;
    completed_at?: string;
}

export function useRoadmap() {
    const { user } = useAuth();
    const [roadmapProgress, setRoadmapProgress] = useState<Record<string, RoadmapItemProgress>>({});
    const [loading, setLoading] = useState(true);

    // Fetch roadmap progress
    useEffect(() => {
        if (!user) {
            setRoadmapProgress({});
            setLoading(false);
            return;
        }

        const fetchRoadmapProgress = async () => {
            const { data, error } = await supabase
                .from("roadmap_progress")
                .select("*")
                .eq("user_id", user.id);

            if (!error && data) {
                const progressMap: Record<string, RoadmapItemProgress> = {};
                data.forEach((item: any) => {
                    progressMap[item.topic_id] = {
                        topic_id: item.topic_id,
                        completed: item.completed,
                        completed_at: item.completed_at,
                    };
                });
                setRoadmapProgress(progressMap);
            }
            setLoading(false);
        };

        fetchRoadmapProgress();
    }, [user]);

    const toggleTopicCompletion = async (topicId: string, completed: boolean) => {
        if (!user) return;

        if (completed) {
            // Mark as completed
            await supabase.from("roadmap_progress").upsert({
                user_id: user.id,
                topic_id: topicId,
                completed: true,
                completed_at: new Date().toISOString(),
            });
        } else {
            // Mark as incomplete
            await supabase.from("roadmap_progress").upsert({
                user_id: user.id,
                topic_id: topicId,
                completed: false,
                completed_at: null,
            });
        }

        setRoadmapProgress((prev) => ({
            ...prev,
            [topicId]: {
                topic_id: topicId,
                completed,
                completed_at: completed ? new Date().toISOString() : undefined,
            },
        }));
    };

    const isTopicCompleted = (topicId: string): boolean => {
        return !!roadmapProgress[topicId]?.completed;
    };

    return { roadmapProgress, loading, toggleTopicCompletion, isTopicCompleted };
}
