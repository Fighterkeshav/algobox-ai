import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { normalizeEmail, sanitizeUsername } from "@/lib/authSecurity";

const PRIMARY_ADMIN_EMAIL = "fighterkeshav7@gmail.com";

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    isAdmin: boolean;
    isPrimaryAdmin: boolean;
    signUp: (email: string, password: string, username?: string) => Promise<{ error: Error | null }>;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signInWithGoogle: () => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isPrimaryAdmin, setIsPrimaryAdmin] = useState(false);

    const checkAdminStatus = async (userEmail: string | undefined) => {
        if (!userEmail) {
            setIsAdmin(false);
            setIsPrimaryAdmin(false);
            return;
        }
        
        const normalized = userEmail.toLowerCase();
        if (normalized === PRIMARY_ADMIN_EMAIL) {
            setIsAdmin(true);
            setIsPrimaryAdmin(true);
            return;
        }
        
        setIsPrimaryAdmin(false);

        try {
            const { data, error } = await (supabase as any)
                .from('admin_users')
                .select('email')
                .eq('email', normalized)
                .maybeSingle(); // Use maybeSingle to avoid 406 errors if no rows
                
            setIsAdmin(!!data);
        } catch (err) {
            setIsAdmin(false);
        }
    };

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            checkAdminStatus(session?.user?.email).finally(() => setLoading(false));
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            await checkAdminStatus(session?.user?.email);
            setLoading(false);

            if (session?.user) {
                // Analytics
                import("@/lib/analytics").then(({ analytics }) => {
                    analytics.identify(session.user.id, {
                        email: session.user.email,
                        username: session.user.user_metadata?.username
                    });
                });

                // Check if this is a new user (created within the last 60 seconds)
                // This handles OAuth signups where signUp() isn't called
                const createdAt = new Date(session.user.created_at);
                const now = new Date();
                const isNewUser = (now.getTime() - createdAt.getTime()) < 60000; // 60 seconds

                // Check if we've already sent a welcome email for this user (localStorage)
                const welcomeEmailSentKey = `welcome_email_sent_${session.user.id}`;
                const alreadySent = localStorage.getItem(welcomeEmailSentKey);

                if (isNewUser && _event === 'SIGNED_IN' && !alreadySent) {
                    try {
                        const { inngestClient } = await import("@/lib/inngest/client");
                        await inngestClient.send({
                            name: "user.signup",
                            data: {
                                userId: session.user.id,
                                email: session.user.email || '',
                                name: session.user.user_metadata?.full_name ||
                                    session.user.user_metadata?.username ||
                                    session.user.email?.split('@')[0] || 'User',
                            },
                        });
                        // Mark as sent to prevent duplicate emails
                        localStorage.setItem(welcomeEmailSentKey, 'true');
                    } catch (e) {
                        // Silently fail - email is not critical
                    }
                }
            } else if (_event === 'SIGNED_OUT') {
                import("@/lib/analytics").then(({ analytics }) => {
                    analytics.reset();
                });
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email: string, password: string, username?: string) => {
        const normalizedEmail = normalizeEmail(email);
        const sanitizedUsername = sanitizeUsername(username);

        const { data, error } = await supabase.auth.signUp({
            email: normalizedEmail,
            password,
            options: {
                data: { username: sanitizedUsername },
            },
        });

        // Trigger welcome email via Inngest if signup successful
        if (!error && data?.user) {
            try {
                const { inngestClient } = await import("@/lib/inngest/client");
                await inngestClient.send({
                    name: "user.signup",
                    data: {
                        userId: data.user.id,
                        email: normalizedEmail,
                        name: sanitizedUsername || normalizedEmail.split('@')[0],
                    },
                });
            } catch (e) {
                console.error("Failed to trigger welcome email:", e);
            }
        }

        return { error };
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email: normalizeEmail(email),
            password,
        });
        return { error };
    };

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin,
            },
        });
        return { error };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, isAdmin, isPrimaryAdmin, signUp, signIn, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
