import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
    PATTERN_CATEGORIES,
    PATTERNS,
    getPatternsByCategory,
    getHighFrequencyPatterns,
} from "@/lib/patterns/patternLibrary";
import {
    Search,
    BookOpen,
    TrendingUp,
    Clock,
    Building2,
    ChevronRight,
    Sparkles,
    Target,
    Zap,
    Filter,
    CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgress } from "@/hooks/useProgress";

export default function Patterns() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showHighFrequency, setShowHighFrequency] = useState(false);

    // Get real user progress
    const { progress } = useProgress();

    // Filter patterns based on search and filters
    const filteredPatterns = PATTERNS.filter((pattern) => {
        const matchesSearch =
            searchQuery === "" ||
            pattern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pattern.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pattern.companies.some((c) =>
                c.toLowerCase().includes(searchQuery.toLowerCase())
            );

        const matchesCategory =
            !selectedCategory || pattern.category === selectedCategory;

        const matchesFrequency = !showHighFrequency || pattern.interviewFrequency >= 80;

        return matchesSearch && matchesCategory && matchesFrequency;
    });

    const topPatterns = getHighFrequencyPatterns().slice(0, 5);

    return (
        <div className="p-6 lg:p-8 space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold lg:text-3xl">Algorithm Patterns</h1>
                            <Badge variant="info" className="gap-1">
                                <Sparkles className="h-3 w-3" />
                                {PATTERNS.length} Patterns
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">
                            Master reusable templates that apply to hundreds of problems
                        </p>
                    </div>
                    <Link to="/algorithm-picker">
                        <Button className="gap-2">
                            <Target className="h-4 w-4" />
                            Which Algorithm?
                        </Button>
                    </Link>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search patterns, companies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button
                        variant={showHighFrequency ? "default" : "outline"}
                        onClick={() => setShowHighFrequency(!showHighFrequency)}
                        className="gap-2"
                    >
                        <TrendingUp className="h-4 w-4" />
                        High ROI
                    </Button>
                </div>
            </motion.div>

            {/* Top Interview Patterns */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-primary/20 bg-primary/5 p-6"
            >
                <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold text-lg">Top Interview Patterns</h2>
                    <Badge variant="outline" className="ml-2">
                        Highest ROI
                    </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {topPatterns.map((pattern, idx) => (
                        <Link key={pattern.id} to={`/patterns/${pattern.id}`}>
                            <div className="group flex items-center gap-3 p-3 rounded-lg bg-background border hover:border-primary/40 transition-all">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                                    {idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                                        {pattern.name.replace(/\([^)]*\)/g, "").trim()}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {pattern.interviewFrequency}% interview rate
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* Categories */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Categories
                </h2>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={selectedCategory === null ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(null)}
                    >
                        All
                    </Button>
                    {PATTERN_CATEGORIES.map((category) => (
                        <Button
                            key={category.id}
                            variant={selectedCategory === category.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(category.id)}
                            className="gap-2"
                        >
                            <span>{category.icon}</span>
                            {category.name}
                        </Button>
                    ))}
                </div>
            </motion.div>

            {/* Patterns Grid */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            >
                {filteredPatterns.map((pattern, idx) => (
                    <PatternCard
                        key={pattern.id}
                        pattern={pattern}
                        delay={idx * 0.05}
                        progress={progress}
                    />
                ))}
            </motion.div>

            {filteredPatterns.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No patterns found matching your criteria</p>
                </div>
            )}
        </div>
    );
}

interface PatternCardProps {
    pattern: (typeof PATTERNS)[0];
    delay?: number;
    progress: Record<string, { status: string }>;
}

function PatternCard({ pattern, delay = 0, progress }: PatternCardProps) {
    const categoryInfo = PATTERN_CATEGORIES.find((c) => c.id === pattern.category);

    const difficultyColors = {
        beginner: "bg-success/10 text-success border-success/20",
        intermediate: "bg-warning/10 text-warning border-warning/20",
        advanced: "bg-destructive/10 text-destructive border-destructive/20",
    };

    // Calculate real progress
    const totalProblems = pattern.relatedProblems.length;
    const solvedProblems = pattern.relatedProblems.filter(
        (pid) => progress[pid]?.status === "solved"
    ).length;
    const completionPercentage = totalProblems > 0
        ? Math.round((solvedProblems / totalProblems) * 100)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <Link to={`/patterns/${pattern.id}`}>
                <div className="group relative h-full rounded-xl border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-lg flex flex-col">
                    {/* Category Badge */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">{categoryInfo?.icon}</span>
                            <span className="text-xs text-muted-foreground">
                                {categoryInfo?.name}
                            </span>
                        </div>
                        <Badge
                            variant="outline"
                            className={cn("text-[10px]", difficultyColors[pattern.difficulty])}
                        >
                            {pattern.difficulty}
                        </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-base mb-2 group-hover:text-primary transition-colors">
                        {pattern.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
                        {pattern.description}
                    </p>

                    {/* Stats Row */}
                    <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {pattern.timeToLearn}
                        </div>
                        <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {pattern.interviewFrequency}% ROI
                        </div>
                    </div>

                    {/* Real Progress Bar */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Your Progress</span>
                            <span className="font-medium flex items-center gap-1">
                                {solvedProblems}/{totalProblems}
                                {completionPercentage === 100 && (
                                    <CheckCircle2 className="h-3 w-3 text-success" />
                                )}
                            </span>
                        </div>
                        <Progress value={completionPercentage} className="h-1.5" />
                    </div>

                    {/* Company Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                        {pattern.companies.slice(0, 4).map((company) => (
                            <span
                                key={company}
                                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                            >
                                <Building2 className="h-2.5 w-2.5" />
                                {company}
                            </span>
                        ))}
                    </div>

                    {/* Arrow indicator */}
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                </div>
            </Link>
        </motion.div>
    );
}
