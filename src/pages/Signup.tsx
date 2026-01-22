"use client";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const { signUp, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        const { error } = await signUp(email, password, username);
        setLoading(false);

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Account created! Check your email to verify.");
            navigate("/login");
        }
    };

    const handleGoogleSignUp = async () => {
        const { error } = await signInWithGoogle();
        if (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="shadow-input mx-auto w-full max-w-md rounded-2xl bg-card border border-border p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    Create Account
                </h2>
                <p className="mt-1.5 sm:mt-2 max-w-sm text-xs sm:text-sm text-muted-foreground">
                    Start your coding journey with Algobox today
                </p>

                <form className="my-6 sm:my-8" onSubmit={handleSubmit}>
                    <LabelInputContainer className="mb-3 sm:mb-4">
                        <Label htmlFor="username" className="text-xs sm:text-sm">Username</Label>
                        <Input
                            id="username"
                            placeholder="johndoe"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="h-9 sm:h-10 text-sm"
                        />
                    </LabelInputContainer>

                    <LabelInputContainer className="mb-3 sm:mb-4">
                        <Label htmlFor="email" className="text-xs sm:text-sm">Email Address</Label>
                        <Input
                            id="email"
                            placeholder="you@example.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-9 sm:h-10 text-sm"
                        />
                    </LabelInputContainer>

                    <LabelInputContainer className="mb-6 sm:mb-8">
                        <Label htmlFor="password" className="text-xs sm:text-sm">Password</Label>
                        <Input
                            id="password"
                            placeholder="••••••••"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="h-9 sm:h-10 text-sm"
                        />
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">At least 6 characters</p>
                    </LabelInputContainer>

                    <button
                        className="group/btn relative block h-9 sm:h-10 w-full rounded-md bg-gradient-to-br from-primary to-primary/80 font-medium text-sm sm:text-base text-primary-foreground shadow-[0px_1px_0px_0px_rgba(255,255,255,0.1)_inset,0px_-1px_0px_0px_rgba(255,255,255,0.1)_inset] disabled:opacity-50"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                        ) : (
                            <>Sign up &rarr;</>
                        )}
                        <BottomGradient />
                    </button>

                    <div className="my-6 sm:my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent" />

                    <div className="flex flex-col space-y-3 sm:space-y-4">
                        <button
                            className="group/btn shadow-input relative flex h-9 sm:h-10 w-full items-center justify-start space-x-2 rounded-md bg-secondary px-4 font-medium text-secondary-foreground"
                            type="button"
                            onClick={handleGoogleSignUp}
                        >
                            <IconBrandGoogle className="h-4 w-4" />
                            <span className="text-xs sm:text-sm">Continue with Google</span>
                            <BottomGradient />
                        </button>
                    </div>
                </form>

                <p className="text-center text-xs sm:text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
            <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex w-full flex-col space-y-2", className)}>
            {children}
        </div>
    );
};
