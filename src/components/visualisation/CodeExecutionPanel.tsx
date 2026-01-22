import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Code2, Variable, Layers } from "lucide-react";
import {
    ALGORITHM_CODE,
    STEP_LINE_MAPPING,
    type AlgorithmId,
} from "@/lib/algorithms/algorithmCode";

interface CodeExecutionPanelProps {
    algorithm: AlgorithmId;
    currentStep: {
        type: string;
        state: any;
        description: string;
    } | null;
    stepIndex: number;
    totalSteps: number;
}

export function CodeExecutionPanel({
    algorithm,
    currentStep,
    stepIndex,
    totalSteps,
}: CodeExecutionPanelProps) {
    const algorithmInfo = ALGORITHM_CODE[algorithm];
    const lineMapping = STEP_LINE_MAPPING[algorithm];

    // Get the current highlighted line based on step type
    const currentLine = useMemo(() => {
        if (!currentStep) return 0;
        return lineMapping[currentStep.type] || 0;
    }, [currentStep, lineMapping]);

    // Extract variables from step state
    const variables = useMemo(() => {
        if (!currentStep?.state) return [];

        const state = currentStep.state;
        const vars: Array<{ name: string; value: string; type: string; changed?: boolean }> = [];

        // Extract common variables based on algorithm type
        if (state.array !== undefined) {
            vars.push({
                name: "arr",
                value: `[${state.array.join(", ")}]`,
                type: "list",
                changed: true,
            });
        }

        if (state.comparing !== undefined && state.comparing.length > 0) {
            vars.push({
                name: "comparing",
                value: `indices ${state.comparing.join(", ")}`,
                type: "indices",
            });
        }

        if (state.left !== undefined) {
            vars.push({ name: "left", value: String(state.left), type: "int" });
        }
        if (state.right !== undefined) {
            vars.push({ name: "right", value: String(state.right), type: "int" });
        }
        if (state.mid !== undefined && state.mid >= 0) {
            vars.push({ name: "mid", value: String(state.mid), type: "int" });
        }
        if (state.target !== undefined) {
            vars.push({ name: "target", value: String(state.target), type: "int" });
        }
        if (state.pivot !== undefined && state.pivot >= 0) {
            vars.push({ name: "pivot_idx", value: String(state.pivot), type: "int" });
        }
        if (state.i !== undefined && state.i >= 0) {
            vars.push({ name: "i", value: String(state.i), type: "int" });
        }
        if (state.j !== undefined && state.j >= 0) {
            vars.push({ name: "j", value: String(state.j), type: "int" });
        }

        // Graph/pathfinding specific
        if (state.current !== undefined && state.current !== null) {
            if (typeof state.current === "object") {
                vars.push({
                    name: "current",
                    value: `(${state.current.x}, ${state.current.y})`,
                    type: "position",
                });
            } else {
                vars.push({ name: "current", value: String(state.current), type: "node" });
            }
        }

        if (state.distances !== undefined) {
            vars.push({
                name: "distances",
                value: `[${state.distances.map((d: number) => (d === Infinity ? "∞" : d)).join(", ")}]`,
                type: "list",
            });
        }

        if (state.visited !== undefined) {
            if (Array.isArray(state.visited)) {
                vars.push({
                    name: "visited",
                    value: `[${state.visited.join(", ")}]`,
                    type: "set",
                });
            }
        }

        if (state.openSet !== undefined) {
            vars.push({
                name: "open_set",
                value: `${state.openSet.length} nodes`,
                type: "list",
            });
        }

        if (state.closedSet !== undefined) {
            vars.push({
                name: "closed_set",
                value: `${state.closedSet.length} nodes`,
                type: "set",
            });
        }

        if (state.path !== undefined && state.path.length > 0) {
            vars.push({
                name: "path",
                value: `${state.path.length} nodes`,
                type: "list",
                changed: true,
            });
        }

        return vars;
    }, [currentStep]);

    // Parse code into lines
    const codeLines = algorithmInfo.code.split("\n");

    return (
        <div className="flex flex-col gap-4 h-full">
            {/* Code Panel */}
            <Card className="flex-1 border-primary/20 bg-card/50">
                <CardHeader className="py-3 px-4 border-b border-border/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Code2 className="h-4 w-4 text-primary" />
                            <CardTitle className="text-sm font-medium">{algorithmInfo.name} - Code</CardTitle>
                        </div>
                        <Badge variant="outline" className="text-xs">
                            {algorithmInfo.language}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-[280px]">
                        <div className="font-mono text-xs">
                            {codeLines.map((line, index) => {
                                const lineNumber = index + 1;
                                const isCurrentLine = lineNumber === currentLine;
                                const isNextLine = lineNumber === currentLine + 1 && currentStep?.type !== "done";

                                return (
                                    <div
                                        key={index}
                                        className={`
                      flex items-stretch transition-colors duration-200
                      ${isCurrentLine
                                                ? "bg-emerald-500/20 border-l-2 border-emerald-400"
                                                : isNextLine
                                                    ? "bg-amber-500/10 border-l-2 border-amber-400/50"
                                                    : "border-l-2 border-transparent hover:bg-muted/30"
                                            }
                    `}
                                    >
                                        {/* Line number */}
                                        <div
                                            className={`
                        w-8 shrink-0 text-right pr-2 py-0.5 select-none
                        ${isCurrentLine
                                                    ? "text-emerald-400 font-bold"
                                                    : "text-muted-foreground/50"
                                                }
                      `}
                                        >
                                            {lineNumber}
                                        </div>

                                        {/* Execution indicator */}
                                        <div className="w-4 shrink-0 flex items-center justify-center">
                                            {isCurrentLine && (
                                                <span className="text-emerald-400 text-[10px]">▶</span>
                                            )}
                                            {isNextLine && (
                                                <span className="text-amber-400/70 text-[10px]">○</span>
                                            )}
                                        </div>

                                        {/* Code */}
                                        <pre
                                            className={`
                        flex-1 py-0.5 pr-2 whitespace-pre overflow-x-auto
                        ${isCurrentLine ? "text-foreground font-medium" : "text-muted-foreground"}
                      `}
                                        >
                                            {line || " "}
                                        </pre>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Variables Panel */}
            <Card className="border-primary/20 bg-card/50">
                <CardHeader className="py-3 px-4 border-b border-border/50">
                    <div className="flex items-center gap-2">
                        <Variable className="h-4 w-4 text-primary" />
                        <CardTitle className="text-sm font-medium">Variables</CardTitle>
                        <Badge variant="secondary" className="text-[10px] ml-auto">
                            Step {stepIndex + 1}/{totalSteps}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-3">
                    {variables.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2">
                            {variables.map((variable, index) => (
                                <div
                                    key={index}
                                    className={`
                    flex items-center justify-between p-2 rounded-md text-xs font-mono
                    ${variable.changed
                                            ? "bg-emerald-500/10 border border-emerald-500/30"
                                            : "bg-muted/30 border border-transparent"
                                        }
                  `}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-primary font-semibold">{variable.name}</span>
                                        <span className="text-muted-foreground/50">=</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={variable.changed ? "text-emerald-400" : "text-foreground"}>
                                            {variable.value}
                                        </span>
                                        <Badge variant="outline" className="text-[9px] px-1 py-0">
                                            {variable.type}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-xs text-muted-foreground text-center py-4">
                            No variables to display
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Step Description */}
            {currentStep && (
                <div className="px-3 py-2 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center gap-2 mb-1">
                        <Layers className="h-3 w-3 text-primary" />
                        <span className="text-xs font-medium text-primary">Current Operation</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{currentStep.description}</p>
                </div>
            )}
        </div>
    );
}
