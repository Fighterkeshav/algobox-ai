import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useFavorites() {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    // Fetch user's favorites
    useEffect(() => {
        if (!user) {
            setFavorites(new Set());
            setLoading(false);
            return;
        }

        const fetchFavorites = async () => {
            const { data, error } = await supabase
                .from("favorites")
                .select("problem_id")
                .eq("user_id", user.id);

            if (!error && data) {
                setFavorites(new Set(data.map((item: any) => item.problem_id)));
            }
            setLoading(false);
        };

        fetchFavorites();
    }, [user]);

    const toggleFavorite = async (problemId: string) => {
        if (!user) {
            toast.error("Please login to save favorites");
            return;
        }

        const isFavorited = favorites.has(problemId);

        if (isFavorited) {
            // Remove from favorites
            await supabase
                .from("favorites")
                .delete()
                .eq("user_id", user.id)
                .eq("problem_id", problemId);

            setFavorites((prev) => {
                const next = new Set(prev);
                next.delete(problemId);
                return next;
            });
            toast.success("Removed from favorites");
        } else {
            // Add to favorites
            await supabase.from("favorites").insert({
                user_id: user.id,
                problem_id: problemId,
            });

            setFavorites((prev) => new Set([...prev, problemId]));
            toast.success("Added to favorites");
        }
    };

    const isFavorite = (problemId: string): boolean => {
        return favorites.has(problemId);
    };

    return { favorites, loading, toggleFavorite, isFavorite };
}
