import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { PatternShowcase } from "@/components/landing/PatternShowcase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { FloatingElements } from "@/components/ui/FloatingElements";
import {
  ArrowRight,
  Code2,
  Brain,
  Map,
  BarChart3,
  Sparkles,
  Zap,
  Target,
  ChevronRight,
} from "lucide-react";
import {
  useScrollAnimation,
  useStaggerAnimation,
  useTextReveal,
  useHoverAnimation
} from "@/lib/animations";
import { useAuth } from "@/contexts/AuthContext";

const features = [
  {
    icon: <Brain className="h-5 w-5" />,
    title: "AI-Personalized Roadmap",
    description: "Dynamic learning paths that adapt to your skill level, goals, and progress in real-time.",
  },
  {
    icon: <Code2 className="h-5 w-5" />,
    title: "In-Browser Code Editor",
    description: "Write, run, and test code in Python, JavaScript, and C++ without leaving the platform.",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "AI Debugging Assistant",
    description: "Get instant explanations for your mistakes with actionable suggestions to improve.",
  },
  {
    icon: <Target className="h-5 w-5" />,
    title: "Smart Practice System",
    description: "Problems selected based on your weak areas, past mistakes, and confidence scores.",
  },
  {
    icon: <Map className="h-5 w-5" />,
    title: "Interactive Cheat Sheets",
    description: "Auto-generated notes from your solved problems, linked to concepts in your roadmap.",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Progress Analytics",
    description: "Skill heatmaps, mistake patterns, and consistency tracking to optimize your learning.",
  },
];

const stats = [
  { value: "50+", label: "Algorithm Patterns" },
  { value: "500+", label: "Curated Problems" },
  { value: "AI", label: "Powered Learning" },
];

export default function Landing() {
  const { user } = useAuth();
  const heroRef = useScrollAnimation({ animation: "fadeInUp", delay: 0.1 });
  const titleRef = useTextReveal();
  const featuresRef = useStaggerAnimation(0.1, "fadeInUp");
  const statsRef = useStaggerAnimation(0.2, "scaleIn");
  const ctaRef = useScrollAnimation({ animation: "scaleIn", delay: 0.2 });

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans selection:bg-primary/20">
      {/* Subtle Animated Background - Lower intensity for minimalism */}
      <AnimatedBackground variant="default" intensity="low" />
      <FloatingElements count={6} />

      {/* Navigation - Glassmorphism */}
      <nav className="fixed top-0 z-50 w-full glass border-b-0">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Logo size="md" />
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Login</Button>
            </Link>
            <Link to={user ? "/dashboard" : "/signup"}>
              <Button size="sm" className="group glass-button bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 hover:border-primary/40">
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
                <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Clean & Minimal */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 px-6">
        <div className="container relative mx-auto">
          <div
            ref={heroRef}
            className="mx-auto max-w-4xl text-center"
          >
            <Badge variant="outline" className="mb-8 px-4 py-1.5 text-xs font-medium border-primary/20 text-primary bg-primary/5 backdrop-blur-sm rounded-full">
              <Zap className="mr-2 h-3 w-3" />
              AI-Powered Learning Platform
            </Badge>

            <h1 className="mb-6 text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
              <span ref={titleRef} className="block text-foreground drop-shadow-sm">Master Algorithms with</span>
              <span className="block text-primary mt-2 bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent animate-in fade-in zoom-in duration-1000">
                AI-Guided Precision
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              Transform into an industry-ready problem solver. Adaptive roadmaps,
              real-time AI debugging, and personalized practice in a beautiful, distraction-free environment.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to={user ? "/dashboard" : "/signup"} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/roadmap" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base glass hover:bg-white/5 border-white/10">
                  Explore Roadmaps
                </Button>
              </Link>
            </div>

            {/* Stats - Minimal */}
            <div
              ref={statsRef}
              className="mt-16 sm:mt-24 flex items-center justify-center gap-8 sm:gap-16 border-t border-white/5 pt-10"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center group cursor-default">
                  <div className="text-2xl sm:text-4xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Glass Cards */}
      <section className="py-24 relative px-6 bg-gradient-to-b from-transparent to-black/20">
        <div className="container mx-auto">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <h2 className="mb-4 text-3xl sm:text-4xl font-bold tracking-tight">
              Everything You Need to Level Up
            </h2>
            <p className="text-muted-foreground text-lg">
              A complete, futuristic learning ecosystem designed to accelerate your coding journey.
            </p>
          </div>

          <div ref={featuresRef} className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Pattern Showcase Section */}
      <PatternShowcase />

      {/* CTA Section - Minimal Glass */}
      <section className="py-24 relative px-6">
        <div className="container mx-auto max-w-5xl">
          <div ref={ctaRef} className="relative overflow-hidden rounded-3xl border border-white/10 glass-card p-12 text-center">
            {/* Decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-32 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

            <h2 className="relative mb-6 text-3xl sm:text-4xl font-bold">
              Ready to Transform Your Skills?
            </h2>
            <p className="relative mx-auto mb-8 max-w-lg text-lg text-muted-foreground">
              Join developers who are using Algobox to master algorithms and land their dream jobs.
            </p>
            <Link to={user ? "/dashboard" : "/signup"}>
              <Button size="lg" className="relative h-12 px-8 text-base bg-primary hover:bg-primary/90 text-primary-foreground">
                Start Learning Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 bg-black/20">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-xs text-muted-foreground">
            © 2024 Algobox. Built for developers, by developers.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ feature }: { feature: any }) {
  const ref = useHoverAnimation(1.02);
  return (
    <div
      ref={ref}
      className="group relative rounded-2xl border border-white/5 glass-card p-8 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary group-hover:scale-110 transition-transform duration-300">
        {feature.icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
      <ChevronRight className="absolute right-6 top-8 h-4 w-4 text-primary opacity-0 -translate-x-2 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
    </div>
  );
}
