"use client";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { IconBrandGoogle } from "@tabler/icons-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { signIn, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await signIn(email, password);
        setLoading(false);

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Logged in successfully!");
            navigate("/dashboard");
        }
    };

    const handleGoogleSignIn = async () => {
        const { error } = await signInWithGoogle();
        if (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="shadow-input mx-auto w-full max-w-md rounded-2xl bg-card border border-border p-8">
                <h2 className="text-2xl font-bold text-foreground">
                    Welcome Back
                </h2>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    Sign in to continue your learning journey
                </p>

                <form className="my-8" onSubmit={handleSubmit}>
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            placeholder="you@example.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </LabelInputContainer>

                    <LabelInputContainer className="mb-8">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            placeholder="••••••••"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </LabelInputContainer>

                    <button
                        className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-primary to-primary/80 font-medium text-primary-foreground shadow-[0px_1px_0px_0px_rgba(255,255,255,0.1)_inset,0px_-1px_0px_0px_rgba(255,255,255,0.1)_inset] disabled:opacity-50"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                        ) : (
                            <>Sign in &rarr;</>
                        )}
                        <BottomGradient />
                    </button>

                    <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent" />

                    <div className="flex flex-col space-y-4">
                        <button
                            className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-secondary px-4 font-medium text-secondary-foreground"
                            type="button"
                            onClick={handleGoogleSignIn}
                        >
                            <IconBrandGoogle className="h-4 w-4" />
                            <span className="text-sm">Continue with Google</span>
                            <BottomGradient />
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary hover:underline font-medium">
                        Sign up
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
