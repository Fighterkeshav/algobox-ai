
import { useState } from "react";
import { BattleArena } from "@/components/battle/BattleArena";
import { PROBLEMS } from "@/lib/problems/problemLibrary";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Swords } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BattleMode() {
    const navigate = useNavigate();
    const [selectedProblem, setSelectedProblem] = useState<any>(null);

    // Simple problem selector for beta
    if (!selectedProblem) {
        return (
            <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {/* Background Grid Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

                <div className="text-center space-y-4 mb-12 relative z-10">
                    <div className="h-24 w-24 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-cyan-500/20 ring-1 ring-white/10">
                        <Swords className="h-12 w-12 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-slate-400 bg-clip-text text-transparent drop-shadow-sm">
                        Algorithm Battle Arena
                    </h1>
                    <p className="text-muted-foreground max-w-md mx-auto text-lg">
                        Enter the ring. Solve algorithms side-by-side with our AI.
                        Learn optimization by observing a master.
                    </p>
                </div>

                <div className="grid gap-4 w-full max-w-md relative z-10">
                    {PROBLEMS.slice(0, 3).map(p => (
                        <Button
                            key={p.id}
                            variant="outline"
                            className="h-16 justify-between px-6 bg-card/50 backdrop-blur-sm border-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all group relative overflow-hidden"
                            onClick={() => setSelectedProblem(p)}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="font-medium text-lg relative z-10">{p.title}</span>
                            <span className="text-xs font-semibold text-muted-foreground group-hover:text-cyan-400 uppercase tracking-widest relative z-10 bg-white/5 px-2 py-1 rounded">
                                {p.difficulty}
                            </span>
                        </Button>
                    ))}
                </div>

                <Button variant="ghost" className="mt-10 text-muted-foreground hover:text-white relative z-10" onClick={() => navigate('/dashboard')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <div className="h-screen bg-background flex flex-col">
            <div className="p-2 border-b border-border">
                <Button variant="ghost" size="sm" onClick={() => setSelectedProblem(null)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Arena Lobby
                </Button>
            </div>
            <BattleArena problem={selectedProblem} />
        </div>
    );
}
