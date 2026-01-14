import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface Note {
    id: string;
    problem_id: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export function useNotes(problemId?: string) {
    const { user } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch notes for a problem or all notes
    useEffect(() => {
        if (!user) {
            setNotes([]);
            setLoading(false);
            return;
        }

        const fetchNotes = async () => {
            let query = supabase
                .from("notes")
                .select("*")
                .eq("user_id", user.id)
                .order("updated_at", { ascending: false });

            if (problemId) {
                query = query.eq("problem_id", problemId);
            }

            const { data, error } = await query;

            if (!error && data) {
                setNotes(data as Note[]);
            }
            setLoading(false);
        };

        fetchNotes();
    }, [user, problemId]);

    const saveNote = async (problemId: string, content: string) => {
        if (!user) return null;

        // Check if note exists
        const existing = notes.find((n) => n.problem_id === problemId);

        if (existing) {
            // Update
            const { data, error } = await supabase
                .from("notes")
                .update({ content, updated_at: new Date().toISOString() })
                .eq("id", existing.id)
                .select()
                .single();

            if (!error && data) {
                setNotes((prev) =>
                    prev.map((n) => (n.id === existing.id ? (data as Note) : n))
                );
                return data as Note;
            }
        } else {
            // Insert
            const { data, error } = await supabase
                .from("notes")
                .insert({
                    user_id: user.id,
                    problem_id: problemId,
                    content,
                })
                .select()
                .single();

            if (!error && data) {
                setNotes((prev) => [data as Note, ...prev]);
                return data as Note;
            }
        }
        return null;
    };

    const deleteNote = async (noteId: string) => {
        if (!user) return;

        await supabase.from("notes").delete().eq("id", noteId);
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
    };

    const getNoteForProblem = (problemId: string): Note | null => {
        return notes.find((n) => n.problem_id === problemId) || null;
    };

    return { notes, loading, saveNote, deleteNote, getNoteForProblem };
}
