import { useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import {
  ArrowRight,
  Code2,
  Target,
  Flame,
  TrendingUp,
  Clock,
  CheckCircle2,
  Play,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useProgress } from "@/hooks/useProgress";
import { PROBLEMS, getCategories } from "@/lib/problems/problemLibrary";
import { PATTERNS } from "@/lib/patterns/patternLibrary";
import { formatDistanceToNow } from "date-fns";
import {
  useScrollAnimation,
  useStaggerAnimation,
  useTextReveal,
  useGlitchEffect,
  useCountUp,
  useHoverAnimation
} from "@/lib/animations";

export default function Dashboard() {
  const { progress, loading, getSolvedCount } = useProgress();

  // 1. Stats Calculation
  const totalProblems = PROBLEMS.length;
  const completedProblems = getSolvedCount();

  // Calculate Pattern Mastery
  const masteredPatternsCount = useMemo(() => {
    return PATTERNS.filter(pattern => {
      const total = pattern.relatedProblems.length;
      if (total === 0) return false;
      const solved = pattern.relatedProblems.filter(pid => progress[pid]?.status === "solved").length;
      return (solved / total) >= 0.8; // Considered mastered if > 80% problems solved
    }).length;
  }, [progress]);

  // Calculate Streak
  const streak = useMemo(() => {
    const solvedDates = Object.values(progress)
      .filter(p => p.status === "solved" && p.solved_at)
      .map(p => p.solved_at!.split('T')[0]);
    const uniqueDays = new Set(solvedDates);
    return uniqueDays.size;
  }, [progress]);

  // Skill Level
  const skillLevel = useMemo(() => {
    if (completedProblems < 5) return "Beginner";
    if (completedProblems < 20) return "Intermediate";
    return "Advanced";
  }, [completedProblems]);

  // 2. Recent Activity
  const recentProblems = useMemo(() => {
    const active = Object.values(progress).filter(p => p.status !== "not_started");
    return active
      .sort((a, b) => {
        const dateA = a.solved_at ? new Date(a.solved_at).getTime() : 0;
        const dateB = b.solved_at ? new Date(b.solved_at).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 3)
      .map(p => {
        const problem = PROBLEMS.find(prob => prob.id === p.problem_id);
        if (!problem) return null;
        return {
          id: problem.id,
          title: problem.title,
          difficulty: problem.difficulty,
          status: p.status === "solved" ? "completed" : "in-progress",
          time: p.solved_at ? formatDistanceToNow(new Date(p.solved_at), { addSuffix: true }) : "Recently",
        };
      })
      .filter(Boolean);
  }, [progress]);

  // 3. Recommended Topics
  const categoryStats = useMemo(() => {
    const categories = getCategories();
    return categories.map(cat => {
      const catProblems = PROBLEMS.filter(p => p.category === cat);
      const solvedInCat = catProblems.filter(p => progress[p.id]?.status === "solved").length;
      const percent = catProblems.length > 0 ? Math.round((solvedInCat / catProblems.length) * 100) : 0;
      return {
        id: cat,
        name: cat,
        progress: percent,
        problems: catProblems.length,
        solved: solvedInCat
      };
    })
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 3);
  }, [progress]);

  // Animation Refs
  const headerRef = useScrollAnimation({ animation: "fadeInDown", delay: 0.1 }); // Header entry
  const statsRef = useScrollAnimation({ animation: "fadeInUp", stagger: 0.1, delay: 0.2 }); // Stats Grid
  const recentActivityRef = useScrollAnimation({ animation: "fadeInLeft", delay: 0.3 }); // Main Content
  const sidebarRef = useScrollAnimation({ animation: "fadeInRight", delay: 0.4, stagger: 0.2 }); // Sidebar items
  const welcomeTextRef = useTextReveal(); // "Welcome back!" reveal
  const glitchRef = useGlitchEffect(); // Glitch effect on Lottie container

  if (loading) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div
        ref={headerRef}
        className="mb-6 sm:mb-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 ref={welcomeTextRef} className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent overflow-hidden pb-1">
            Welcome back! 👋
          </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">Continue your learning journey</p>
        </div>
        <div ref={glitchRef} className="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 cursor-pointer self-center sm:self-auto">
          <DotLottieReact
            src="https://lottie.host/519b609d-eb4b-4d6e-a5cc-190163f44419/OGhUSxI2BL.lottie"
            loop
            autoplay
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div
        ref={statsRef}
        className="mb-8 grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4"
      >
        <StatCard
          icon={<Target className="h-4 w-4" />}
          label="Problems Solved"
          value={completedProblems}
          subtext={`of ${totalProblems} total`}
          color="primary"
        />
        <StatCard
          icon={<Flame className="h-4 w-4" />}
          label="Total Activity"
          value={streak}
          suffix=" days"
          subtext="Keep grinding!"
          color="warning"
        />
        <StatCard
          icon={<Clock className="h-4 w-4" />}
          label="Est. Hours"
          value={completedProblems * 0.5}
          isFloat
          subtext="Based on solved count"
          color="success"
        />
        <StatCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Skill Level"
          displayValue={skillLevel}
          subtext="Keep it up!"
          color="accent"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Continue Learning */}
          <div
            ref={recentActivityRef}
            className="rounded-2xl border border-white/5 bg-card/50 backdrop-blur-sm p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-lg">Recent Activity</h2>
              <Link to="/practice">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {recentProblems.length > 0 ? recentProblems.map((problem: any) => (
                <RecentProblemItem key={problem.id} problem={problem} />
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No recent activity.</p>
                  <Link to="/practice">
                    <Button variant="link" size="sm" className="mt-1 text-xs">Start your first problem!</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Topics */}
          <div className="rounded-2xl border border-white/5 bg-card/50 backdrop-blur-sm p-6">
            <TopicProgressSection categoryStats={categoryStats} />
          </div>
        </div>

        {/* Sidebar */}
        <div ref={sidebarRef} className="space-y-6">
          {/* Quick Practice */}
          <QuickPracticeCard />

          {/* NEW: Learn Patterns Card */}
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="info" className="text-[10px] bg-primary/20 text-primary hover:bg-primary/30 border-primary/20">
                  NEW FEATURES
                </Badge>
              </div>
              <h3 className="font-semibold text-lg mb-1">Master Patterns</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {masteredPatternsCount > 0
                  ? `You've mastered ${masteredPatternsCount} of ${PATTERNS.length} patterns! Keep going.`
                  : "Learn reusable templates to solve hundreds of problems."}
              </p>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 bg-background/50 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${(masteredPatternsCount / PATTERNS.length) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">{masteredPatternsCount}/{PATTERNS.length}</span>
              </div>

              <div className="space-y-2">
                <Link to="/patterns">
                  <Button variant="default" size="sm" className="w-full justify-start gap-2 text-xs shadow-md">
                    <Sparkles className="h-3 w-3" />
                    Browse Patterns
                  </Button>
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/algorithm-picker">
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs bg-background/50 hover:bg-background">
                      <Target className="h-3 w-3" />
                      Picker
                    </Button>
                  </Link>
                  <Link to="/cheat-sheets">
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs bg-background/50 hover:bg-background">
                      <Code2 className="h-3 w-3" />
                      Cheats
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute -right-6 -top-6 h-24 w-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
          </div>

          {/* Milestones */}
          <div className="rounded-2xl border border-white/5 bg-card/50 backdrop-blur-sm p-6">
            <h3 className="mb-4 font-semibold text-lg">Next Milestone</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Solve 10 Problems</span>
                </div>
                <Progress value={Math.min((completedProblems / 10) * 100, 100)} className="h-2" />
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  Problem Solver Badge
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Solve 50 Problems</span>
                </div>
                <Progress value={Math.min((completedProblems / 50) * 100, 100)} className="h-2" />
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  Master Coder Badge
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

// --- Sub-components with internal animations ---

function RecentProblemItem({ problem }: { problem: any }) {
  const ref = useHoverAnimation(1.02);
  return (
    <div
      ref={ref}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/5 bg-background/50 p-4 transition-colors hover:border-primary/40 cursor-default"
    >
      <div className="flex items-center gap-4">
        <div className={`rounded-xl p-2 ${problem.status === "completed"
          ? "bg-success/10 text-success"
          : "bg-warning/10 text-warning"
          }`}>
          {problem.status === "completed" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium truncate">{problem.title}</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant={problem.difficulty as "beginner" | "intermediate" | "advanced"} className="text-[10px] px-2 py-0.5">
              {problem.difficulty}
            </Badge>
            <span>•</span>
            <span className="truncate">{problem.time}</span>
          </div>
        </div>
      </div>
      <Link to={`/practice?id=${problem.id}`}>
        <Button variant="ghost" size="sm" className="text-xs w-full sm:w-auto">
          {problem.status === "completed" ? "Review" : "Continue"}
        </Button>
      </Link>
    </div>
  );
}


interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value?: number | string;
  displayValue?: string;
  subtext: string;
  color: "primary" | "success" | "warning" | "accent";
  suffix?: string;
  isFloat?: boolean;
}

function StatCard({ icon, label, value, displayValue, subtext, color, suffix = "", isFloat = false }: StatCardProps) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    accent: "bg-accent/10 text-accent",
  };

  const countRef = useRef<HTMLDivElement>(null);
  useCountUp(typeof value === 'number' ? value : 0, 2);

  return (
    <div className="rounded-2xl border border-white/5 glass-card p-4 transition-colors hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div className={`mb-2 inline-flex rounded-lg p-1.5 ${colorClasses[color]}`}>
        {icon}
      </div>
      <div className="text-xl font-bold flex items-baseline">
        {typeof value === 'number' ? (
          <span ref={countRef}>{isFloat ? value.toFixed(1) : value}</span>
        ) : (
          <span>{displayValue || value}</span>
        )}
        {suffix && <span className="ml-1 text-sm font-normal text-muted-foreground">{suffix}</span>}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-[10px] text-muted-foreground hidden sm:block">{subtext}</div>
    </div>
  );
}

function TopicProgressSection({ categoryStats }: { categoryStats: any[] }) {
  const ref = useStaggerAnimation(0.1, "fadeInUp");
  return (
    <>
      <div className="mb-3 sm:mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <h2 className="font-semibold text-base sm:text-lg">Topic Progress</h2>
        </div>
        <Link to="/roadmap">
          <Button variant="ghost" size="sm" className="text-[10px] sm:text-xs">
            Full Roadmap <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </div>
      <div ref={ref} className="space-y-3 sm:space-y-4">
        {categoryStats.map((topic) => (
          <div key={topic.id} className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-medium truncate mr-2">{topic.name}</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground flex-shrink-0">
                {topic.solved} / {topic.problems}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Progress value={topic.progress} className="flex-1 h-1.5 sm:h-2" />
              <span className="text-[10px] sm:text-xs font-medium text-primary w-6 sm:w-8">{topic.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function QuickPracticeCard() {
  const glitchRef = useGlitchEffect();
  return (
    <div
      ref={glitchRef}
      className="rounded-2xl border border-border bg-card p-6 relative overflow-hidden"
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <Code2 className="h-8 w-8 text-primary" />
          <div className="h-20 w-20 -mt-2 -mr-2 opacity-90">
            <DotLottieReact
              src="https://lottie.host/04bf57ab-2b8c-4088-8041-b7c14fea6aea/8sRGvO0CxH.lottie"
              loop
              autoplay
            />
          </div>
        </div>
        <h3 className="mb-2 font-semibold text-lg">Quick Practice</h3>
        <p className="mb-6 text-sm text-muted-foreground">
          AI will select the best problem for you based on your progress.
        </p>
        <Link to="/practice">
          <Button size="sm" className="w-full font-semibold text-sm">
            Start Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full blur-3xl -z-0" />
    </div>
  );
}
