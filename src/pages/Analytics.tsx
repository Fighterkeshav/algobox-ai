import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Flame,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Zap,
} from "lucide-react";

// Mock analytics data
const weeklyActivity = [
  { day: "Mon", problems: 5, minutes: 45 },
  { day: "Tue", problems: 3, minutes: 30 },
  { day: "Wed", problems: 7, minutes: 65 },
  { day: "Thu", problems: 4, minutes: 40 },
  { day: "Fri", problems: 6, minutes: 55 },
  { day: "Sat", problems: 2, minutes: 20 },
  { day: "Sun", problems: 8, minutes: 75 },
];

const skillBreakdown = [
  { name: "Arrays", level: 85, trend: "up" },
  { name: "Strings", level: 72, trend: "up" },
  { name: "Hash Tables", level: 65, trend: "up" },
  { name: "Linked Lists", level: 45, trend: "down" },
  { name: "Trees", level: 30, trend: "neutral" },
  { name: "Dynamic Programming", level: 20, trend: "up" },
];

const mistakePatterns = [
  { pattern: "Off-by-one errors", count: 12, percentage: 28 },
  { pattern: "Edge case handling", count: 9, percentage: 21 },
  { pattern: "Time complexity", count: 7, percentage: 16 },
  { pattern: "Wrong data structure", count: 6, percentage: 14 },
  { pattern: "Incorrect base case", count: 5, percentage: 12 },
  { pattern: "Other", count: 4, percentage: 9 },
];

const stats = {
  totalProblems: 47,
  thisWeek: 35,
  avgTimePerProblem: "12 min",
  successRate: 78,
  currentStreak: 12,
  longestStreak: 23,
};

export default function Analytics() {
  const maxProblems = Math.max(...weeklyActivity.map(d => d.problems));

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold lg:text-3xl">Progress Analytics</h1>
        <p className="text-muted-foreground">Track your learning journey and identify areas for improvement</p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard
          icon={<Target className="h-5 w-5" />}
          label="Total Problems"
          value={stats.totalProblems.toString()}
          change={`+${stats.thisWeek} this week`}
          trend="up"
        />
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="Avg. Time"
          value={stats.avgTimePerProblem}
          change="-2 min from last week"
          trend="up"
        />
        <StatCard
          icon={<Zap className="h-5 w-5" />}
          label="Success Rate"
          value={`${stats.successRate}%`}
          change="+5% improvement"
          trend="up"
        />
        <StatCard
          icon={<Flame className="h-5 w-5" />}
          label="Current Streak"
          value={`${stats.currentStreak} days`}
          change={`Best: ${stats.longestStreak} days`}
          trend="neutral"
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Weekly Activity</h2>
            </div>
            <Badge variant="info">This Week</Badge>
          </div>
          
          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-48">
            {weeklyActivity.map((day) => (
              <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-primary/20 transition-all hover:bg-primary/40 relative group"
                  style={{ height: `${(day.problems / maxProblems) * 100}%`, minHeight: "8px" }}
                >
                  <div 
                    className="absolute bottom-0 left-0 right-0 rounded-t-md bg-primary transition-all"
                    style={{ height: `${(day.problems / maxProblems) * 100}%` }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover border border-border rounded px-2 py-1 text-xs whitespace-nowrap">
                    {day.problems} problems
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{day.day}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total: {weeklyActivity.reduce((sum, d) => sum + d.problems, 0)} problems</span>
            <span className="text-muted-foreground">
              Time: {Math.round(weeklyActivity.reduce((sum, d) => sum + d.minutes, 0) / 60)}h {weeklyActivity.reduce((sum, d) => sum + d.minutes, 0) % 60}m
            </span>
          </div>
        </motion.div>

        {/* Skill Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Skill Breakdown</h2>
            </div>
          </div>

          <div className="space-y-4">
            {skillBreakdown.map((skill) => (
              <div key={skill.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    {skill.trend === "up" && <TrendingUp className="h-4 w-4 text-success" />}
                    {skill.trend === "down" && <TrendingDown className="h-4 w-4 text-destructive" />}
                  </div>
                </div>
                <Progress value={skill.level} className="h-2" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mistake Patterns */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Common Mistakes</h2>
            </div>
            <Badge variant="warning">{mistakePatterns.reduce((sum, p) => sum + p.count, 0)} total</Badge>
          </div>

          <div className="space-y-3">
            {mistakePatterns.map((pattern, index) => (
              <div key={pattern.pattern} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{pattern.pattern}</span>
                    <span className="text-sm text-muted-foreground">{pattern.count}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-destructive/60"
                      style={{ width: `${pattern.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Consistency Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Practice Consistency</h2>
            </div>
            <Badge variant="success">12 day streak</Badge>
          </div>

          {/* Simplified Heatmap Grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => {
              const intensity = Math.random();
              return (
                <div
                  key={i}
                  className="aspect-square rounded-sm transition-colors hover:ring-1 hover:ring-primary"
                  style={{
                    backgroundColor:
                      intensity > 0.8
                        ? "hsl(var(--success))"
                        : intensity > 0.5
                        ? "hsl(var(--success) / 0.6)"
                        : intensity > 0.2
                        ? "hsl(var(--success) / 0.3)"
                        : "hsl(var(--muted))",
                  }}
                />
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-sm bg-muted" />
              <div className="h-3 w-3 rounded-sm bg-success/30" />
              <div className="h-3 w-3 rounded-sm bg-success/60" />
              <div className="h-3 w-3 rounded-sm bg-success" />
            </div>
            <span>More</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
}

function StatCard({ icon, label, value, change, trend }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
      <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
        {icon}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className={`mt-1 flex items-center gap-1 text-xs ${
        trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground"
      }`}>
        {trend === "up" && <TrendingUp className="h-3 w-3" />}
        {trend === "down" && <TrendingDown className="h-3 w-3" />}
        {change}
      </div>
    </div>
  );
}
