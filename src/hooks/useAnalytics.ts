import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PROBLEMS } from "@/lib/problems/problemLibrary";
import { subDays, format, isSameDay, startOfWeek, addDays } from "date-fns";

export interface AnalyticsData {
    totalProblems: number;
    solvedCount: number;
    attemptedCount: number;
    successRate: number;
    thisWeekCount: number;
    avgTimePerProblem: string; // Placeholder or calculated if we had time data
    currentStreak: number;
    longestStreak: number;
    weeklyActivity: { day: string; problems: number; date: Date }[];
    skillBreakdown: { name: string; level: number; total: number; solved: number }[];
    loading: boolean;
}

export function useAnalytics() {
    const { user } = useAuth();
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchAnalytics = async () => {
            const { data: progressData, error } = await supabase
                .from("problem_progress")
                .select("*")
                .eq("user_id", user.id);

            if (error || !progressData) {
                setLoading(false);
                return;
            }

            // 1. Basic Counts
            const totalProblems = progressData.length;
            const solvedProblems = progressData.filter(p => p.status === "solved");
            const solvedCount = solvedProblems.length;
            const attemptedCount = totalProblems - solvedCount;
            const successRate = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

            // 2. Weekly Activity (Last 7 days relative to today)
            // Note: Chart expects Mon-Sun. Let's give it last 7 days ending today or fixed week?
            // "Weekly Activity" usually implies the current week or trailing 7 days.
            // Let's do trailing 7 days for simplicity or aligned to Mon-Sun.
            // Implementation: Last 7 days.
            const today = new Date();
            const weeklyActivity = Array.from({ length: 7 }).map((_, i) => {
                // 6 days ago to today
                const d = subDays(today, 6 - i);
                const dayLabel = format(d, "EEE"); // Mon, Tue...
                // Count problems solved/updated on this day
                const count = progressData.filter(p => {
                    const pDate = new Date(p.solved_at || p.updated_at);
                    return isSameDay(pDate, d);
                }).length;

                return { day: dayLabel, problems: count, date: d };
            });

            const thisWeekCount = weeklyActivity.reduce((acc, d) => acc + d.problems, 0);

            // 3. Skill Breakdown
            // Map problems to tags
            const tagStats: Record<string, { total: number; solved: number }> = {};

            // Initialize with common tags to ensure they appear even if empty?
            // Or just dynamic. Let's do dynamic based on what we have + some defaults if needed.
            // Better: Iterate all PROBLEMS to get total pool size per tag.

            const allTags = new Set<string>();
            PROBLEMS.forEach(p => {
                p.tags.forEach(t => allTags.add(t));
            });

            // Calculate total available problems per tag
            const tagTotals: Record<string, number> = {};
            PROBLEMS.forEach(p => {
                p.tags.forEach(t => {
                    tagTotals[t] = (tagTotals[t] || 0) + 1;
                });
            });

            // Calculate solved per tag
            const tagSolved: Record<string, number> = {};
            solvedProblems.forEach(sp => {
                const problem = PROBLEMS.find(p => p.id === sp.problem_id);
                if (problem) {
                    problem.tags.forEach(t => {
                        tagSolved[t] = (tagSolved[t] || 0) + 1;
                    });
                }
            });

            let skillBreakdown = Array.from(allTags).map(tag => {
                const total = tagTotals[tag] || 0;
                const solved = tagSolved[tag] || 0;
                const level = total > 0 ? Math.round((solved / total) * 100) : 0;
                return { name: tag, level, total, solved };
            });

            // Sort by level dest and take top 5-6
            skillBreakdown.sort((a, b) => b.level - a.level);
            skillBreakdown = skillBreakdown.slice(0, 6);

            // 4. Streaks
            // Sort solved dates
            const solvedDates = solvedProblems
                .map(p => new Date(p.solved_at || p.updated_at)) // solved_at might be null if manually toggled? schema says solved_at string|null.
                .filter(d => !isNaN(d.getTime()))
                .sort((a, b) => b.getTime() - a.getTime()); // Descending

            // Basic streak calc
            let currentStreak = 0;
            let checkDate = new Date();
            // Normalize checkDate to midnight? logic:
            // If solved today, streak starts 1. If not, check yesterday.

            // Simplify: get unique dates (YYYY-MM-DD)
            const uniqueDates = new Set(solvedDates.map(d => format(d, 'yyyy-MM-dd')));

            // Check today
            if (uniqueDates.has(format(today, 'yyyy-MM-dd'))) {
                currentStreak++;
                let d = subDays(today, 1);
                while (uniqueDates.has(format(d, 'yyyy-MM-dd'))) {
                    currentStreak++;
                    d = subDays(d, 1);
                }
            } else {
                // Check yesterday
                let d = subDays(today, 1);
                while (uniqueDates.has(format(d, 'yyyy-MM-dd'))) {
                    currentStreak++;
                    d = subDays(d, 1);
                }
            }

            setData({
                totalProblems,
                solvedCount,
                attemptedCount,
                successRate,
                thisWeekCount,
                avgTimePerProblem: "N/A", // We don't track time spent yet
                currentStreak,
                longestStreak: currentStreak, // Placeholder, would need full history scan
                weeklyActivity,
                skillBreakdown,
                loading: false
            });
            setLoading(false);
        };

        fetchAnalytics();
    }, [user]);

    return { data, loading };
}
