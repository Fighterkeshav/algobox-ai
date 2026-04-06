import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    BookOpen,
    Clock,
    HardDrive,
    ThumbsUp,
    ThumbsDown,
    Lightbulb
} from "lucide-react";
import { type AlgorithmId } from "@/lib/algorithms/algorithmCode";
import { ALGORITHM_DETAILS } from "@/lib/algorithms/algorithmDetails";
import ReactMarkdown from "react-markdown";

interface DetailedNotesPanelProps {
    algorithm: AlgorithmId;
}

export function DetailedNotesPanel({ algorithm }: DetailedNotesPanelProps) {
    const details = ALGORITHM_DETAILS[algorithm];

    if (!details) return null;

    return (
        <Card className="h-full border-primary/20 bg-card/50 flex flex-col">
            <CardHeader className="py-4 border-b border-border/50">
                <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">Expert Notes: {details.name}</CardTitle>
                </div>
                <CardDescription>{details.summary}</CardDescription>
            </CardHeader>

            <CardContent className="p-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    <div className="p-6 space-y-8">

                        {/* Complexity Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                                <div className="flex items-center gap-2 mb-2 text-primary">
                                    <Clock className="h-4 w-4" />
                                    <span className="font-semibold text-sm">Time Complexity</span>
                                </div>
                                <p className="text-2xl font-bold font-mono">{details.complexity.time}</p>
                            </div>
                            <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                                <div className="flex items-center gap-2 mb-2 text-primary">
                                    <HardDrive className="h-4 w-4" />
                                    <span className="font-semibold text-sm">Space Complexity</span>
                                </div>
                                <p className="text-2xl font-bold font-mono">{details.complexity.space}</p>
                            </div>
                        </div>

                        {/* Pros & Cons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <h3 className="font-semibold flex items-center gap-2 text-emerald-500">
                                    <ThumbsUp className="h-4 w-4" /> Strengths
                                </h3>
                                <ul className="space-y-2">
                                    {details.pros.map((pro, idx) => (
                                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                            <span className="block h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                            {pro}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-3">
                                <h3 className="font-semibold flex items-center gap-2 text-rose-500">
                                    <ThumbsDown className="h-4 w-4" /> Limitations
                                </h3>
                                <ul className="space-y-2">
                                    {details.cons.map((con, idx) => (
                                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                            <span className="block h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                                            {con}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Deep Dive Theory */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                                <Lightbulb className="h-5 w-5 text-amber-500" />
                                <h3 className="font-semibold text-lg">Deep Dive</h3>
                            </div>
                            <div className="prose prose-sm prose-invert max-w-none text-muted-foreground">
                                <ReactMarkdown>{details.details}</ReactMarkdown>
                            </div>
                        </div>

                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
