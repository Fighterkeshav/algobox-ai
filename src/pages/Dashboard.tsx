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
  BookOpen,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useProgress } from "@/hooks/useProgress";
import { PROBLEMS, getCategories } from "@/lib/problems/problemLibrary";
import { PATTERNS } from "@/lib/patterns/patternLibrary";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function Dashboard() {
  const { progress, loading, getSolvedCount } = useProgress();

  const totalProblems = PROBLEMS.length;
  const completedProblems = getSolvedCount();

  const masteredPatternsCount = useMemo(() => {
    return PATTERNS.filter(pattern => {
      const total = pattern.relatedProblems.length;
      if (total === 0) return false;
      const solved = pattern.relatedProblems.filter(pid => progress[pid]?.status === "solved").length;
      return (solved / total) >= 0.8;
    }).length;
  }, [progress]);

  const streak = useMemo(() => {
    const solvedDates = Object.values(progress)
      .filter(p => p.status === "solved" && p.solved_at)
      .map(p => p.solved_at!.split('T')[0]);
    return new Set(solvedDates).size;
  }, [progress]);

  const skillLevel = useMemo(() => {
    if (completedProblems < 5) return "Beginner";
    if (completedProblems < 20) return "Intermediate";
    return "Advanced";
  }, [completedProblems]);

  const recentProblems = useMemo(() => {
    const active = Object.values(progress).filter(p => p.status !== "not_started");
    return active
      .sort((a, b) => {
        const dateA = a.solved_at ? new Date(a.solved_at).getTime() : 0;
        const dateB = b.solved_at ? new Date(b.solved_at).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 4)
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

  const categoryStats = useMemo(() => {
    const categories = getCategories();
    return categories.map(cat => {
      const catProblems = PROBLEMS.filter(p => p.category === cat);
      const solvedInCat = catProblems.filter(p => progress[p.id]?.status === "solved").length;
      const percent = catProblems.length > 0 ? Math.round((solvedInCat / catProblems.length) * 100) : 0;
      return { id: cat, name: cat, progress: percent, problems: catProblems.length, solved: solvedInCat };
    })
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 4);
  }, [progress]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6 sm:mb-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            Welcome back! <span className="inline-block animate-float">👋</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Continue your learning journey</p>
        </div>
        <div className="h-20 w-20 sm:h-28 sm:w-28 self-center sm:self-auto opacity-90">
          <DotLottieReact
            src="https://lottie.host/519b609d-eb4b-4d6e-a5cc-190163f44419/OGhUSxI2BL.lottie"
            loop autoplay
          />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="mb-6 sm:mb-8 grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Target className="h-4 w-4" />} label="Problems Solved" value={completedProblems} subtext={`of ${totalProblems} total`} color="primary" />
        <StatCard icon={<Flame className="h-4 w-4" />} label="Active Days" value={streak} suffix=" days" subtext="Keep grinding!" color="warning" />
        <StatCard icon={<Clock className="h-4 w-4" />} label="Est. Hours" value={completedProblems * 0.5} isFloat subtext="Based on solved count" color="success" />
        <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Skill Level" displayValue={skillLevel} subtext="Keep it up!" color="accent" />
      </motion.div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-4 sm:space-y-6 lg:col-span-2">
          {/* Recent Activity */}
          <motion.div variants={itemVariants} className="rounded-2xl glass-card p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-base sm:text-lg">Recent Activity</h2>
              <Link to="/practice">
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                  View All <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentProblems.length > 0 ? recentProblems.map((problem: any) => (
                <RecentProblemItem key={problem.id} problem={problem} />
              )) : (
                <div className="text-center py-10 text-muted-foreground">
                  <Code2 className="h-8 w-8 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No recent activity yet.</p>
                  <Link to="/practice">
                    <Button variant="link" size="sm" className="mt-1 text-xs text-primary">Start your first problem!</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Topic Progress */}
          <motion.div variants={itemVariants} className="rounded-2xl glass-card p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-base sm:text-lg">Topic Progress</h2>
              </div>
              <Link to="/roadmap">
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                  Full Roadmap <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3.5">
              {categoryStats.map((topic) => (
                <div key={topic.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-medium truncate mr-2">{topic.name}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{topic.solved}/{topic.problems}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Progress value={topic.progress} className="flex-1 h-1.5" />
                    <span className="text-[10px] sm:text-xs font-semibold text-primary w-8 text-right">{topic.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-5">
          {/* Quick Practice */}
          <motion.div variants={itemVariants}>
            <div className="rounded-2xl glass-card-hover p-5 sm:p-6 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="rounded-xl bg-primary/10 p-2.5 ring-1 ring-primary/20">
                    <Code2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="h-16 w-16 opacity-80">
                    <DotLottieReact
                      src="https://lottie.host/04bf57ab-2b8c-4088-8041-b7c14fea6aea/8sRGvO0CxH.lottie"
                      loop autoplay
                    />
                  </div>
                </div>
                <h3 className="mb-1.5 font-semibold text-base sm:text-lg">Quick Practice</h3>
                <p className="mb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  AI selects the best problem based on your progress.
                </p>
                <Link to="/practice">
                  <Button size="sm" className="w-full font-medium text-sm bg-primary hover:bg-primary/90 shadow-lg shadow-primary/15">
                    Start Now <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
              <div className="absolute -right-8 -top-8 h-28 w-28 bg-primary/[0.06] rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-700" />
            </div>
          </motion.div>

          {/* Master Patterns */}
          <motion.div variants={itemVariants}>
            <div className="rounded-2xl glass-card p-5 sm:p-6 relative overflow-hidden border-primary/10">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="text-[10px] bg-primary/15 text-primary hover:bg-primary/20 border-primary/20 font-semibold">
                    <Zap className="h-2.5 w-2.5 mr-1" />
                    PATTERNS
                  </Badge>
                </div>
                <h3 className="font-semibold text-base sm:text-lg mb-1">Master Patterns</h3>
                <p className="mb-4 text-xs text-muted-foreground">
                  {masteredPatternsCount > 0
                    ? `${masteredPatternsCount} of ${PATTERNS.length} patterns mastered!`
                    : "Learn reusable templates to solve hundreds of problems."}
                </p>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 bg-background/50 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full transition-all duration-700"
                      style={{ width: `${Math.max((masteredPatternsCount / PATTERNS.length) * 100, 2)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground">{masteredPatternsCount}/{PATTERNS.length}</span>
                </div>

                <div className="space-y-2">
                  <Link to="/patterns">
                    <Button variant="default" size="sm" className="w-full justify-start gap-2 text-xs shadow-md">
                      <BookOpen className="h-3 w-3" /> Browse Patterns
                    </Button>
                  </Link>
                  <div className="grid grid-cols-2 gap-2">
                    <Link to="/algorithm-picker">
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.06]">
                        <Target className="h-3 w-3" /> Picker
                      </Button>
                    </Link>
                    <Link to="/cheat-sheets">
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.06]">
                        <Code2 className="h-3 w-3" /> Cheats
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="absolute -right-6 -bottom-6 h-24 w-24 bg-primary/[0.05] rounded-full blur-2xl" />
            </div>
          </motion.div>

          {/* Milestones */}
          <motion.div variants={itemVariants}>
            <div className="rounded-2xl glass-card p-5 sm:p-6">
              <h3 className="mb-4 font-semibold text-base sm:text-lg">Next Milestone</h3>
              <div className="space-y-4">
                <MilestoneItem label="Solve 10 Problems" badge="Problem Solver" current={completedProblems} target={10} />
                <MilestoneItem label="Solve 50 Problems" badge="Master Coder" current={completedProblems} target={50} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Sub-components ---

function MilestoneItem({ label, badge, current, target }: { label: string; badge: string; current: number; target: number }) {
  const pct = Math.min((current / target) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-[10px] text-muted-foreground">{Math.round(pct)}%</span>
      </div>
      <Progress value={pct} className="h-1.5" />
      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{badge}</p>
    </div>
  );
}

function RecentProblemItem({ problem }: { problem: any }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3.5 sm:p-4 transition-all duration-300 hover:border-primary/20 hover:bg-white/[0.04] cursor-default group">
      <div className="flex items-center gap-3.5">
        <div className={`rounded-lg p-2 ${problem.status === "completed"
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-amber-500/10 text-amber-400"
          }`}>
          {problem.status === "completed" ? <CheckCircle2 className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium truncate group-hover:text-foreground transition-colors">{problem.title}</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
            <Badge variant={problem.difficulty as "beginner" | "intermediate" | "advanced"} className="text-[9px] px-1.5 py-0">
              {problem.difficulty}
            </Badge>
            <span className="text-muted-foreground/50">·</span>
            <span className="truncate">{problem.time}</span>
          </div>
        </div>
      </div>
      <Link to={`/practice?id=${problem.id}`}>
        <Button variant="ghost" size="sm" className="text-xs w-full sm:w-auto text-muted-foreground hover:text-primary">
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
  const colorMap = {
    primary: { bg: "bg-primary/10", text: "text-primary", glow: "group-hover:shadow-primary/10" },
    success: { bg: "bg-emerald-500/10", text: "text-emerald-400", glow: "group-hover:shadow-emerald-500/10" },
    warning: { bg: "bg-amber-500/10", text: "text-amber-400", glow: "group-hover:shadow-amber-500/10" },
    accent: { bg: "bg-primary/10", text: "text-primary", glow: "group-hover:shadow-primary/10" },
  };
  const c = colorMap[color];

  return (
    <div className={`group rounded-2xl glass-card p-3.5 sm:p-4 transition-all duration-500 hover:border-white/[0.12] hover:shadow-lg ${c.glow}`}>
      <div className={`mb-2.5 inline-flex rounded-lg p-1.5 ${c.bg} ${c.text}`}>
        {icon}
      </div>
      <div className="text-lg sm:text-xl font-bold flex items-baseline">
        {typeof value === 'number' ? (
          <span>{isFloat ? value.toFixed(1) : value}</span>
        ) : (
          <span>{displayValue || value}</span>
        )}
        {suffix && <span className="ml-1 text-xs font-normal text-muted-foreground">{suffix}</span>}
      </div>
      <div className="text-[11px] text-muted-foreground font-medium">{label}</div>
      <div className="mt-0.5 text-[10px] text-muted-foreground/60 hidden sm:block">{subtext}</div>
    </div>
  );
}
