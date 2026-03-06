import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { PatternShowcase } from "@/components/landing/PatternShowcase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
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
  Play,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const features = [
  {
    icon: <Brain className="h-5 w-5" />,
    title: "AI-Personalized Roadmap",
    description: "Dynamic learning paths that adapt to your skill level, goals, and progress in real-time.",
    gradient: "from-violet-500/20 to-indigo-500/20",
  },
  {
    icon: <Code2 className="h-5 w-5" />,
    title: "In-Browser Code Editor",
    description: "Write, run, and test code in Python, JavaScript, and C++ without leaving the platform.",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "AI Debugging Assistant",
    description: "Get instant explanations for your mistakes with actionable suggestions to improve.",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: <Target className="h-5 w-5" />,
    title: "Smart Practice System",
    description: "Problems selected based on your weak areas, past mistakes, and confidence scores.",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: <Map className="h-5 w-5" />,
    title: "Interactive Cheat Sheets",
    description: "Auto-generated notes from your solved problems, linked to concepts in your roadmap.",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Progress Analytics",
    description: "Skill heatmaps, mistake patterns, and consistency tracking to optimize your learning.",
    gradient: "from-rose-500/20 to-red-500/20",
  },
];

const stats = [
  { value: "50+", label: "Algorithm Patterns" },
  { value: "500+", label: "Curated Problems" },
  { value: "AI", label: "Powered Learning" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground variant="default" intensity="low" />

      {/* Ambient glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-[5]">
        <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-primary/[0.07] blur-[120px]" />
        <div className="absolute top-[60%] -left-[200px] w-[500px] h-[500px] rounded-full bg-blue-600/[0.05] blur-[100px]" />
        <div className="absolute top-[40%] -right-[200px] w-[400px] h-[400px] rounded-full bg-violet-600/[0.04] blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/[0.04] bg-background/60 backdrop-blur-2xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Logo size="md" />
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-sm">
                Login
              </Button>
            </Link>
            <Link to={user ? "/dashboard" : "/signup"}>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 text-sm">
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 sm:pt-40 sm:pb-28 px-4 sm:px-6">
        <div className="container relative mx-auto">
          <motion.div
            className="mx-auto max-w-4xl text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Badge variant="outline" className="mb-6 sm:mb-8 px-4 py-1.5 text-xs font-medium border-primary/20 text-primary bg-primary/[0.06] backdrop-blur-sm rounded-full">
                <Zap className="mr-2 h-3 w-3" />
                AI-Powered Learning Platform
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mb-5 sm:mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight"
            >
              <span className="block text-foreground">Master Algorithms</span>
              <span className="block mt-1 sm:mt-2 gradient-text-animated text-glow">
                with AI Precision
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mx-auto mb-8 sm:mb-10 max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              Transform into an industry-ready problem solver with adaptive roadmaps,
              real-time AI debugging, and personalized practice — all in one beautiful platform.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <Link to={user ? "/dashboard" : "/signup"} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-sm sm:text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:shadow-primary/40 hover:scale-[1.02]">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/roadmap" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-sm sm:text-base border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all">
                  <Play className="mr-2 h-4 w-4" />
                  Explore Roadmaps
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="mt-14 sm:mt-20 flex items-center justify-center gap-8 sm:gap-16"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center group cursor-default">
                  <div className="text-2xl sm:text-4xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="divider-glow" />

      {/* Features Section */}
      <section className="py-20 sm:py-28 relative px-4 sm:px-6">
        <div className="container mx-auto">
          <motion.div
            className="mb-14 sm:mb-16 text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Everything You Need to <span className="gradient-text">Level Up</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
              A complete learning ecosystem designed to accelerate your coding journey.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pattern Showcase */}
      <PatternShowcase />

      {/* CTA Section */}
      <section className="py-20 sm:py-28 relative px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="relative overflow-hidden rounded-3xl p-8 sm:p-12 md:p-16 text-center glass-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-primary/15 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[100px] bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

            <h2 className="relative mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl font-bold">
              Ready to Transform <br className="hidden sm:block" />
              <span className="gradient-text">Your Skills?</span>
            </h2>
            <p className="relative mx-auto mb-6 sm:mb-8 max-w-lg text-sm sm:text-base text-muted-foreground">
              Join developers who are using Algobox to master algorithms and land their dream jobs.
            </p>
            <Link to={user ? "/dashboard" : "/signup"}>
              <Button size="lg" className="relative h-12 px-8 text-sm sm:text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.02]">
                Start Learning Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8 px-4 sm:px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-xs text-muted-foreground">
            © 2025 Algobox. Built for developers, by developers.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ feature }: { feature: typeof features[0] }) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative rounded-2xl glass-card-hover p-6 sm:p-7"
    >
      <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-3 text-primary ring-1 ring-white/[0.06] group-hover:ring-primary/20 transition-all duration-500`}>
        {feature.icon}
      </div>
      <h3 className="mb-2 text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
        {feature.title}
      </h3>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {feature.description}
      </p>
      <ChevronRight className="absolute right-5 top-7 h-4 w-4 text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-60" />
    </motion.div>
  );
}
