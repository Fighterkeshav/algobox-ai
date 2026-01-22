import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    ArrowRight,
    TrendingUp,
    Clock,
    Sparkles,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    PATTERN_CATEGORIES,
    getHighFrequencyPatterns,
} from "@/lib/patterns/patternLibrary";

export function PatternShowcase() {
    const topPatterns = getHighFrequencyPatterns().slice(0, 6);

    return (
        <section className="py-12 sm:py-16 relative px-4">
            <div className="container mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <Badge variant="outline" className="mb-4">
                        <Sparkles className="mr-1.5 h-3 w-3" />
                        Pattern-Based Learning
                    </Badge>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                        Master Algorithm Patterns, Not Just Problems
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Learn reusable templates that apply to hundreds of coding problems.
                        Our data shows these patterns cover 90%+ of interview questions.
                    </p>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {PATTERN_CATEGORIES.slice(0, 6).map((category) => (
                        <div
                            key={category.id}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border text-sm"
                        >
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                        </div>
                    ))}
                    <div className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        +{PATTERN_CATEGORIES.length - 6} more
                    </div>
                </div>

                {/* Top Patterns Grid */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                    {topPatterns.map((pattern, idx) => {
                        const category = PATTERN_CATEGORIES.find(
                            (c) => c.id === pattern.category
                        );

                        return (
                            <motion.div
                                key={pattern.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Link to="/signup">
                                    <div className="group relative h-full rounded-xl border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-lg">
                                        {/* Rank Badge */}
                                        <div className="absolute -top-2 -left-2 flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md">
                                            #{idx + 1}
                                        </div>

                                        {/* Category */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <span>{category?.icon}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {category?.name}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                                            {pattern.name}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                            {pattern.description}
                                        </p>

                                        {/* Stats */}
                                        <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {pattern.timeToLearn}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <TrendingUp className="h-3 w-3" />
                                                {pattern.interviewFrequency}% ROI
                                            </div>
                                        </div>

                                        {/* Interview Frequency Bar */}
                                        <div>
                                            <Progress
                                                value={pattern.interviewFrequency}
                                                className="h-1.5"
                                            />
                                        </div>

                                        {/* Arrow */}
                                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link to="/signup">
                        <Button size="lg" className="gap-2">
                            Explore All Patterns
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
