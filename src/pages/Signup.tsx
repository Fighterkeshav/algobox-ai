"use client";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { IconBrandGoogle } from "@tabler/icons-react";
import { motion } from "framer-motion";
import {
  isValidEmail,
  mapAuthErrorMessage,
  normalizeEmail,
  sanitizeUsername,
  validatePasswordStrength,
} from "@/lib/authSecurity";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = normalizeEmail(email);
    if (!isValidEmail(normalizedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      toast.error("Use 8+ chars with uppercase, lowercase, number, and symbol.");
      return;
    }
    const cleanedUsername = sanitizeUsername(username);
    setLoading(true);
    const { error } = await signUp(normalizedEmail, password, cleanedUsername);
    setLoading(false);
    if (error) {
      toast.error(mapAuthErrorMessage(error.message));
    } else {
      toast.success("Account created! Check your email to verify.");
      navigate("/login");
    }
  };

  const handleGoogleSignUp = async () => {
    const { error } = await signInWithGoogle();
    if (error) toast.error(error.message);
  };

  const inputClasses = "h-10 text-sm bg-white/[0.03] border-white/[0.08] focus:border-primary/40 focus:ring-primary/20 transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/[0.06] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-violet-600/[0.04] blur-[100px] rounded-full" />
      </div>

      <motion.div
        className="relative z-10 mx-auto w-full max-w-md rounded-2xl glass-card p-6 sm:p-8"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Create Account</h2>
        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
          Start your coding journey with Algobox today
        </p>

        <form className="my-6 sm:my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-3 sm:mb-4">
            <Label htmlFor="username" className="text-xs sm:text-sm font-medium">Username</Label>
            <Input id="username" placeholder="johndoe" type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={inputClasses} />
          </LabelInputContainer>

          <LabelInputContainer className="mb-3 sm:mb-4">
            <Label htmlFor="email" className="text-xs sm:text-sm font-medium">Email Address</Label>
            <Input id="email" placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClasses} />
          </LabelInputContainer>

          <LabelInputContainer className="mb-3 sm:mb-4">
            <Label htmlFor="password" className="text-xs sm:text-sm font-medium">Password</Label>
            <Input id="password" placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className={inputClasses} />
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">8+ chars with upper/lowercase, number, symbol</p>
          </LabelInputContainer>

          <LabelInputContainer className="mb-6">
            <Label htmlFor="confirmPassword" className="text-xs sm:text-sm font-medium">Confirm Password</Label>
            <Input id="confirmPassword" placeholder="••••••••" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} className={inputClasses} />
          </LabelInputContainer>

          <button
            className="group relative block h-10 w-full rounded-lg bg-primary font-medium text-sm text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:bg-primary/90 transition-all duration-300 disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              <span className="flex items-center justify-center gap-2">
                Create Account <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            )}
          </button>

          <div className="my-6 divider-glow" />

          <button
            className="group relative flex h-10 w-full items-center justify-center gap-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/[0.15] font-medium text-sm text-foreground transition-all duration-300"
            type="button"
            onClick={handleGoogleSignUp}
          >
            <IconBrandGoogle className="h-4 w-4" />
            <span>Continue with Google</span>
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
);
