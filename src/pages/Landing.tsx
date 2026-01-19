import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
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

const features = [
  {
    icon: <Brain className="h-6 w-6" />,
    title: "AI-Personalized Roadmap",
    description: "Dynamic learning paths that adapt to your skill level, goals, and progress in real-time.",
  },
  {
    icon: <Code2 className="h-6 w-6" />,
    title: "In-Browser Code Editor",
    description: "Write, run, and test code in Python, JavaScript, and C++ without leaving the platform.",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "AI Debugging Assistant",
    description: "Get instant explanations for your mistakes with actionable suggestions to improve.",
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Smart Practice System",
    description: "Problems selected based on your weak areas, past mistakes, and confidence scores.",
  },
  {
    icon: <Map className="h-6 w-6" />,
    title: "Interactive Cheat Sheets",
    description: "Auto-generated notes from your solved problems, linked to concepts in your roadmap.",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Progress Analytics",
    description: "Skill heatmaps, mistake patterns, and consistency tracking to optimize your learning.",
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Gamified Learning",
    description: "Earn badges, maintain streaks, and climb the leaderboard as you master new algorithms.",
  },
];

const stats = [
  { value: "50+", label: "Algorithm Patterns" },
  { value: "500+", label: "Curated Problems" },
  { value: "AI", label: "Powered Learning" },
];

export default function Landing() {
  const heroRef = useScrollAnimation({ animation: "fadeInUp", delay: 0.1 });
  const titleRef = useTextReveal(); // For "Master Algorithms..."
  const featuresRef = useStaggerAnimation(0.1, "fadeInUp");
  const statsRef = useStaggerAnimation(0.2, "scaleIn");
  const ctaRef = useScrollAnimation({ animation: "scaleIn", delay: 0.2 });

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle Animated Background */}
      <AnimatedBackground variant="default" intensity="low" />
      <FloatingElements count={8} />

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Logo size="md" />
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">Login</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="group text-xs sm:text-sm px-2 sm:px-4">
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
                <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 px-4">
        <div className="container relative mx-auto">
          <div
            ref={heroRef}
            className="mx-auto max-w-3xl text-center"
          >
            <Badge variant="outline" className="mb-4 sm:mb-5 text-[10px] sm:text-xs font-medium">
              <Zap className="mr-1 sm:mr-1.5 h-2.5 w-2.5 sm:h-3 sm:w-3" />
              AI-Powered Learning Platform
            </Badge>

            <h1 className="mb-4 sm:mb-5 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              <span ref={titleRef} className="block">Master Algorithms with</span>
              <span className="block text-primary mt-1 bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                AI-Guided Precision
              </span>
            </h1>

            <p className="mx-auto mb-6 sm:mb-8 max-w-xl text-sm sm:text-base md:text-lg text-muted-foreground px-2">
              Transform into an industry-ready problem solver through
              adaptive roadmaps, real-time AI debugging, and personalized practice.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="group animate-pulse hover:animate-none w-full sm:w-auto">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/roadmap" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Roadmaps
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div
              ref={statsRef}
              className="mt-10 sm:mt-12 flex items-center justify-center gap-6 sm:gap-8 md:gap-12"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 relative px-4">
        <div className="container mx-auto">
          <div className="mb-8 sm:mb-10 text-center">
            <h2 className="mb-2 sm:mb-3 text-xl sm:text-2xl md:text-3xl font-bold">
              Everything You Need to Level Up
            </h2>
            <p className="mx-auto max-w-xl text-xs sm:text-sm md:text-base text-muted-foreground px-2">
              A complete learning ecosystem designed to accelerate your coding journey.
            </p>
          </div>

          <div ref={featuresRef} className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 relative px-4">
        <div className="container mx-auto">
          <div ref={ctaRef} className="relative overflow-hidden rounded-xl border border-border bg-card p-6 sm:p-8 md:p-10 text-center">
            <h2 className="mb-2 sm:mb-3 text-xl sm:text-2xl md:text-3xl font-bold">
              Ready to Transform Your Coding Skills?
            </h2>
            <p className="mx-auto mb-5 sm:mb-6 max-w-lg text-xs sm:text-sm md:text-base text-muted-foreground">
              Join developers who are using Algobox to master algorithms and land their dream jobs.
            </p>
            <Link to="/signup">
              <Button size="lg">
                Start Learning Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-4 sm:py-6 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <Logo size="sm" />
          <p className="text-[10px] sm:text-xs text-muted-foreground text-center sm:text-left">
            © 2024 Algobox. Built for developers, by developers.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ feature }: { feature: any }) {
  const ref = useHoverAnimation(1.05);
  return (
    <div
      ref={ref}
      className="group relative rounded-lg border border-border bg-card p-4 sm:p-5 transition-colors hover:border-primary/40"
    >
      <div className="mb-2 sm:mb-3 inline-flex rounded-md bg-primary/10 p-2 sm:p-2.5 text-primary">
        {feature.icon}
      </div>
      <h3 className="mb-1 sm:mb-1.5 text-sm sm:text-base font-semibold">{feature.title}</h3>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
      <ChevronRight className="absolute right-3 sm:right-4 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
    </div>
  );
}
