

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
import { useAnalytics } from "@/hooks/useAnalytics";

export default function Analytics() {
  const { data, loading } = useAnalytics();

  // While loading or if no data, show skeletons or empty state?
  // For now simple return or use default empty values
  const stats = data || {
    totalProblems: 0,
    solvedCount: 0,
    successRate: 0,
    currentStreak: 0,
    longestStreak: 0,
    thisWeekCount: 0,
    avgTimePerProblem: "N/A",
    weeklyActivity: [],
    skillBreakdown: []
  };

  const maxProblems = Math.max(...(stats.weeklyActivity.length > 0 ? stats.weeklyActivity.map(d => d.problems) : [1]));

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
          value={stats.solvedCount.toString()}
          change={`+${stats.thisWeekCount} this week`}
          trend="up"
        />
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="Avg. Time"
          value={stats.avgTimePerProblem}
          change="-- min from last week"
          trend="neutral"
        />
        <StatCard
          icon={<Zap className="h-5 w-5" />}
          label="Success Rate"
          value={`${stats.successRate}%`}
          change="Keep it up!"
          trend="up"
        />
        <StatCard
          icon={<Flame className="h-5 w-5" />}
          label="Current Streak"
          value={`${stats.currentStreak} days`}
          change={`Best: ${stats.longestStreak} days`}
          trend={stats.currentStreak > 0 ? "up" : "neutral"}
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
            <Badge variant="info">Last 7 Days</Badge>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-48">
            {stats.weeklyActivity.length > 0 ? stats.weeklyActivity.map((day, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
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
            )) : <div className="w-full h-full flex items-center justify-center text-muted-foreground">No activity data yet</div>}
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total: {stats.thisWeekCount} problems</span>
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
            {stats.skillBreakdown.length > 0 ? stats.skillBreakdown.map((skill) => (
              <div key={skill.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{skill.level}% ({skill.solved}/{skill.total})</span>
                  </div>
                </div>
                <Progress value={skill.level} className="h-2" />
              </div>
            )) : <div className="text-center text-muted-foreground py-10">Solve problems to see skill stats</div>}
          </div>
        </motion.div>

        {/* Consistency Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl border border-border bg-card p-6 lg:col-span-2"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Practice Consistency</h2>
            </div>
            <Badge variant="success">{stats.currentStreak} day streak</Badge>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:grid-cols-[repeat(auto-fit,minmax(30px,1fr))]">
            {/* Simplified placeholder for heatmap - full impl requires 365 days of data */}
            {/* Just showing last 30 days as a placeholder for now until we have full history */}
            {Array.from({ length: 30 }).map((_, i) => {
              // Mocking visual intensity for non-data days just to keep UI looking roughly same structure,
              // but ideally this should be real. 
              // Since we don't have full history, I'll just show "gray" for unknown days and green for known active days?
              // Let's just keep it simple: Render days, but all gray if 0.
              return (
                <div
                  key={i}
                  className="aspect-square rounded-sm bg-muted transition-colors hover:ring-1 hover:ring-primary"
                  title="No data"
                />
              );
            })}
          </div>
          <div className="mt-2 text-xs text-center text-muted-foreground">Heatmap requires more history to be meaningful.</div>
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
      <div className={`mt-1 flex items-center gap-1 text-xs ${trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground"
        }`}>
        {trend === "up" && <TrendingUp className="h-3 w-3" />}
        {trend === "down" && <TrendingDown className="h-3 w-3" />}
        {change}
      </div>
    </div>
  );
}
