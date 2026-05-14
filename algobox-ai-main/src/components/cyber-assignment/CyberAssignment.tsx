import { useState, useEffect } from "react";
import { ALL_CHALLENGES } from "@/components/cyber-practice/challengeRegistry";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, RotateCcw, CheckCircle, XCircle, Code, BookOpen, MessageSquare, Terminal } from "lucide-react";
import Editor from "@monaco-editor/react";
import { CyberMentorChat } from "./CyberMentorChat";

interface CyberAssignmentProps {
    labId?: string;
}

export function CyberAssignment({ labId }: CyberAssignmentProps) {
    const [currentChallengeId, setCurrentChallengeId] = useState<string | null>(null);

    // Sync when prop changes
    useEffect(() => {
        if (labId) {
            const match = ALL_CHALLENGES.find(c => c.id === labId);
            if (match) {
                setCurrentChallengeId(match.id);
            } else {
                setCurrentChallengeId(null);
            }
        } else {
            setCurrentChallengeId(ALL_CHALLENGES[0].id);
        }
    }, [labId]);

    const currentChallenge = ALL_CHALLENGES.find(c => c.id === currentChallengeId);

    // State for the editor
    const [code, setCode] = useState("");
    const [results, setResults] = useState<{ name: string; passed: boolean; message?: string }[] | null>(null);

    // Reset editor when challenge changes
    useEffect(() => {
        if (currentChallenge) {
            setCode(currentChallenge.vulnerableCode);
            setResults(null);
        }
    }, [currentChallengeId]);

    const runTests = () => {
        if (!currentChallenge) return;
        const testResults = currentChallenge.verify(code);
        setResults(testResults);
    };

    const resetCode = () => {
        if (!currentChallenge) return;
        setCode(currentChallenge.vulnerableCode);
        setResults(null);
    };

    const isSuccess = results?.every(r => r.passed);

    // Handle "Not Found" State
    if (!currentChallenge) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="p-6 rounded-full bg-slate-900/50 border border-slate-800">
                    <Code className="h-12 w-12 text-slate-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-200">Challenge Under Construction</h2>
                <div className="flex gap-2">
                    {ALL_CHALLENGES.map(c => (
                        <Button key={c.id} variant="secondary" size="sm" onClick={() => setCurrentChallengeId(c.id)}>
                            {c.title}
                        </Button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="border-indigo-500/50 text-indigo-400 uppercase tracking-widest text-[10px]">
                            Assignment Active
                        </Badge>
                        <h2 className="text-xl font-bold text-white tracking-tight">
                            {currentChallenge.title}
                        </h2>
                    </div>
                    <p className="text-slate-400 text-sm max-w-2xl text-muted-foreground">{currentChallenge.description}</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Results summary if verified */}
                    {isSuccess && (
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/50 px-3 py-1 animate-in fade-in">
                            <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                            Passed +100 XP
                        </Badge>
                    )}

                    <Button
                        onClick={runTests}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg shadow-green-900/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <Play className="w-4 h-4 mr-2" />
                        Run & Submit
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                {/* Left: Editor Column */}
                <Card className="flex flex-col bg-[#1e1e1e] border-slate-800 overflow-hidden shadow-2xl">
                    <div className="h-10 px-4 bg-[#252526] flex justify-between items-center border-b border-slate-700 shrink-0">
                        <div className="flex items-center gap-2">
                            <Code className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-xs text-slate-300 font-mono">vulnerable_app.js</span>
                        </div>
                        <Button size="icon-sm" variant="ghost" onClick={resetCode} title="Reset Code" className="h-6 w-6 hover:bg-slate-700 text-slate-400">
                            <RotateCcw className="h-3 w-3" />
                        </Button>
                    </div>
                    <div className="flex-1 relative min-h-0">
                        <Editor
                            height="100%"
                            defaultLanguage="javascript"
                            theme="vs-dark"
                            value={code}
                            onChange={(val) => setCode(val || "")}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 13,
                                scrollBeyondLastLine: false,
                                padding: { top: 16 },
                                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                            }}
                        />
                    </div>
                    {/* Inline Console/Results for Editor */}
                    {results && (
                        <div className="border-t border-slate-700 bg-[#1e1e1e] max-h-[30%] overflow-y-auto shrink-0 animate-in slide-in-from-bottom duration-300">
                            <div className="p-3 border-b border-slate-800/50 bg-[#252526] text-xs font-semibold text-slate-300 flex items-center gap-2 sticky top-0">
                                <Terminal className="w-3.5 h-3.5" />
                                Execution Results
                            </div>
                            <div className="p-3 space-y-2">
                                {results.map((result, idx) => (
                                    <div key={idx} className={`p-2 rounded text-xs border flex items-start gap-2 ${result.passed ? 'bg-green-950/20 border-green-900/50 text-green-300' : 'bg-red-950/20 border-red-900/50 text-red-300'}`}>
                                        {result.passed ? <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                                        <div className="flex-1">
                                            <div className="font-mono font-medium">{result.name}</div>
                                            {result.message && <div className="mt-1 opacity-80">{result.message}</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>

                {/* Right: Instructions & Mentor */}
                <div className="flex flex-col min-h-0">
                    <Tabs defaultValue="mentor" className="flex-1 flex flex-col min-h-0">
                        <TabsList className="grid w-full grid-cols-2 bg-slate-900 border border-slate-800 mb-0 rounded-b-none shrink-0 h-10">
                            <TabsTrigger value="info" className="data-[state=active]:bg-slate-800 rounded-b-none border-b-2 border-transparent data-[state=active]:border-indigo-500 rounded-none h-full">
                                <BookOpen className="w-3.5 h-3.5 mr-2" />
                                Mission Brief
                            </TabsTrigger>
                            <TabsTrigger value="mentor" className="rounded-b-none border-b-2 border-transparent data-[state=active]:border-purple-500 rounded-none h-full data-[state=active]:bg-purple-500/5 text-purple-300/70 data-[state=active]:text-purple-300">
                                <MessageSquare className="w-3.5 h-3.5 mr-2" />
                                AI Mentor
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex-1 min-h-0 bg-slate-900/30 border-x border-b border-slate-800 rounded-b-lg overflow-hidden relative">
                            <TabsContent value="info" className="h-full m-0 overflow-auto p-6 space-y-4">
                                <h3 className="font-bold text-lg text-slate-200">Mission Objectives</h3>
                                <div className="prose prose-invert prose-sm max-w-none text-slate-300/90 leading-relaxed whitespace-pre-line">
                                    {currentChallenge.instructions}
                                </div>
                            </TabsContent>

                            <TabsContent value="mentor" className="h-full m-0 flex flex-col">
                                <CyberMentorChat challenge={currentChallenge} />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div >
        </div >
    );
}



