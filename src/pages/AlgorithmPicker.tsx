import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    ArrowLeft,
    ArrowRight,
    RotateCcw,
    Target,
    Sparkles,
    CheckCircle2,
    HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FlowNode {
    id: string;
    question: string;
    hint?: string;
    options: {
        label: string;
        nextId?: string;
        result?: {
            pattern: string;
            patternId: string;
            explanation: string;
        };
    }[];
}

const flowchart: FlowNode[] = [
    {
        id: "start",
        question: "What type of data structure are you working with?",
        hint: "Consider the primary data structure in the problem.",
        options: [
            { label: "Array / String", nextId: "array-type" },
            { label: "Linked List", nextId: "linked-list" },
            { label: "Tree", nextId: "tree" },
            { label: "Graph", nextId: "graph" },
            { label: "None / Math", nextId: "math" },
        ],
    },
    {
        id: "array-type",
        question: "Is the array sorted or can it be sorted?",
        hint: "Sorted arrays often enable binary search approaches.",
        options: [
            { label: "Yes, sorted", nextId: "sorted-array" },
            { label: "No, unsorted", nextId: "unsorted-array" },
            { label: "It's a String", nextId: "string-type" },
        ],
    },
    {
        id: "sorted-array",
        question: "What are you looking for?",
        options: [
            {
                label: "A specific target value",
                result: {
                    pattern: "Binary Search (Basic)",
                    patternId: "binary-search-basic",
                    explanation:
                        "Use basic binary search to find the target in O(log n) time.",
                },
            },
            {
                label: "First/last occurrence or boundary",
                result: {
                    pattern: "Binary Search (Boundary)",
                    patternId: "binary-search-boundary",
                    explanation:
                        "Use boundary binary search to find the first/last position where a condition is true.",
                },
            },
            {
                label: "Pairs that sum to target",
                result: {
                    pattern: "Two Pointers (Opposite Direction)",
                    patternId: "two-pointers-opposite",
                    explanation:
                        "Use two pointers from opposite ends to find pairs efficiently.",
                },
            },
        ],
    },
    {
        id: "unsorted-array",
        question: "What's the main operation you need?",
        options: [
            { label: "Find subarrays with conditions", nextId: "subarray" },
            { label: "Find pairs/triplets", nextId: "pairs" },
            { label: "Track maximum/minimum", nextId: "optimize" },
        ],
    },
    {
        id: "subarray",
        question: "Is the subarray contiguous (no gaps)?",
        options: [
            {
                label: "Yes, contiguous subarray",
                result: {
                    pattern: "Sliding Window",
                    patternId: "variable-sliding-window",
                    explanation:
                        "Variable sliding window is perfect for finding longest/shortest contiguous subarrays.",
                },
            },
            {
                label: "No, can skip elements",
                result: {
                    pattern: "Dynamic Programming (1D)",
                    patternId: "dp-1d",
                    explanation:
                        "Use DP when you need to make optimal choices with potentially non-contiguous elements.",
                },
            },
        ],
    },
    {
        id: "pairs",
        question: "Can you sort the array first?",
        options: [
            {
                label: "Yes, order doesn't matter",
                result: {
                    pattern: "Two Pointers (Opposite Direction)",
                    patternId: "two-pointers-opposite",
                    explanation:
                        "Sort first, then use two pointers from opposite ends to find pairs.",
                },
            },
            {
                label: "No, need original order",
                result: {
                    pattern: "Hash Table Lookup",
                    patternId: "two-pointers-opposite",
                    explanation:
                        "Use a hash map to store seen elements for O(1) lookup while maintaining order.",
                },
            },
        ],
    },
    {
        id: "optimize",
        question: "Do you need to track next greater/smaller elements?",
        options: [
            {
                label: "Yes",
                result: {
                    pattern: "Monotonic Stack",
                    patternId: "monotonic-stack",
                    explanation:
                        "Monotonic stack efficiently tracks next greater/smaller elements in O(n).",
                },
            },
            {
                label: "No, just overall max/min",
                result: {
                    pattern: "Dynamic Programming (1D)",
                    patternId: "dp-1d",
                    explanation:
                        "Use 1D DP to track optimal values as you iterate through the array.",
                },
            },
        ],
    },
    {
        id: "string-type",
        question: "What are you looking for in the string?",
        options: [
            {
                label: "Longest/shortest substring",
                result: {
                    pattern: "Sliding Window",
                    patternId: "variable-sliding-window",
                    explanation:
                        "Variable sliding window is the go-to pattern for substring problems.",
                },
            },
            {
                label: "Matching brackets/parentheses",
                result: {
                    pattern: "Stack for Parentheses",
                    patternId: "stack-parentheses",
                    explanation:
                        "Use a stack to match opening and closing brackets in the correct order.",
                },
            },
            {
                label: "Palindrome check",
                result: {
                    pattern: "Two Pointers (Opposite Direction)",
                    patternId: "two-pointers-opposite",
                    explanation: "Use two pointers from opposite ends comparing characters.",
                },
            },
        ],
    },
    {
        id: "linked-list",
        question: "What's the main operation?",
        options: [
            {
                label: "Detect or find cycle",
                result: {
                    pattern: "Fast & Slow Pointers",
                    patternId: "fast-slow-pointers",
                    explanation:
                        "Floyd's cycle detection uses two pointers moving at different speeds.",
                },
            },
            {
                label: "Find middle element",
                result: {
                    pattern: "Fast & Slow Pointers",
                    patternId: "fast-slow-pointers",
                    explanation:
                        "When fast pointer reaches end, slow pointer is at middle.",
                },
            },
            {
                label: "Reverse or modify",
                result: {
                    pattern: "Two Pointers (Same Direction)",
                    patternId: "two-pointers-opposite",
                    explanation:
                        "Use prev/current pointers to reverse or modify linked list nodes.",
                },
            },
        ],
    },
    {
        id: "tree",
        question: "How do you need to traverse the tree?",
        options: [
            {
                label: "Level by level (BFS)",
                result: {
                    pattern: "BFS Tree Traversal",
                    patternId: "bfs-tree",
                    explanation:
                        "Use a queue for level-order traversal, processing all nodes at each depth.",
                },
            },
            {
                label: "Depth first (preorder/inorder/postorder)",
                result: {
                    pattern: "DFS Tree Traversal",
                    patternId: "dfs-tree",
                    explanation:
                        "Use recursion or explicit stack for depth-first exploration.",
                },
            },
            {
                label: "Find path or validate BST",
                result: {
                    pattern: "DFS Tree Traversal",
                    patternId: "dfs-tree",
                    explanation:
                        "DFS with recursion is ideal for path finding and BST validation.",
                },
            },
        ],
    },
    {
        id: "graph",
        question: "What's the graph operation?",
        options: [
            {
                label: "Shortest path (unweighted)",
                result: {
                    pattern: "BFS Graph",
                    patternId: "bfs-tree",
                    explanation:
                        "BFS finds shortest path in unweighted graphs by exploring level by level.",
                },
            },
            {
                label: "Explore all paths / detect cycle",
                result: {
                    pattern: "DFS Graph",
                    patternId: "dfs-tree",
                    explanation: "DFS explores as deep as possible, useful for cycle detection.",
                },
            },
            {
                label: "Dependency ordering",
                result: {
                    pattern: "Topological Sort",
                    patternId: "dfs-tree",
                    explanation:
                        "Use DFS-based topological sort for ordering nodes with dependencies.",
                },
            },
        ],
    },
    {
        id: "math",
        question: "What type of mathematical operation?",
        options: [
            {
                label: "Generate all combinations/permutations",
                result: {
                    pattern: "Backtracking",
                    patternId: "backtracking-combinations",
                    explanation:
                        "Backtracking systematically explores all possibilities with pruning.",
                },
            },
            {
                label: "Optimization problem",
                result: {
                    pattern: "Dynamic Programming",
                    patternId: "dp-1d",
                    explanation:
                        "DP is ideal for optimization with overlapping subproblems.",
                },
            },
            {
                label: "Number manipulation",
                result: {
                    pattern: "Math / Bit Manipulation",
                    patternId: "binary-search-basic",
                    explanation:
                        "Use mathematical properties or bit operations for number problems.",
                },
            },
        ],
    },
];

export default function AlgorithmPicker() {
    const [currentNodeId, setCurrentNodeId] = useState("start");
    const [history, setHistory] = useState<string[]>(["start"]);
    const [result, setResult] = useState<{
        pattern: string;
        patternId: string;
        explanation: string;
    } | null>(null);

    const currentNode = flowchart.find((n) => n.id === currentNodeId);

    const handleOptionClick = (option: (typeof flowchart)[0]["options"][0]) => {
        if (option.result) {
            setResult(option.result);
        } else if (option.nextId) {
            setHistory([...history, option.nextId]);
            setCurrentNodeId(option.nextId);
        }
    };

    const handleBack = () => {
        if (history.length > 1) {
            const newHistory = history.slice(0, -1);
            setHistory(newHistory);
            setCurrentNodeId(newHistory[newHistory.length - 1]);
            setResult(null);
        }
    };

    const handleReset = () => {
        setCurrentNodeId("start");
        setHistory(["start"]);
        setResult(null);
    };

    return (
        <div className="p-6 lg:p-8 max-w-3xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                    <Target className="h-5 w-5" />
                    <span className="font-medium">Algorithm Picker</span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                    Which Algorithm Should I Use?
                </h1>
                <p className="text-muted-foreground">
                    Answer a few questions to find the right pattern for your problem
                </p>
            </motion.div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 mb-8">
                {history.map((_, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all",
                            idx === history.length - 1 && !result
                                ? "w-6 bg-primary"
                                : result && idx === history.length - 1
                                    ? "w-6 bg-success"
                                    : "bg-muted"
                        )}
                    />
                ))}
                {result && (
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                )}
            </div>

            <AnimatePresence mode="wait">
                {result ? (
                    /* Result Card */
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <Card className="p-8 text-center border-success/30 bg-success/5">
                            <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
                            <h2 className="text-xl font-bold mb-2">Recommended Pattern</h2>

                            <Link to={`/patterns/${result.patternId}`}>
                                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-lg mb-4 hover:bg-primary/90 transition-colors">
                                    <Sparkles className="h-5 w-5" />
                                    {result.pattern}
                                    <ArrowRight className="h-5 w-5" />
                                </div>
                            </Link>

                            <p className="text-muted-foreground mb-6">{result.explanation}</p>

                            <div className="flex items-center justify-center gap-4">
                                <Button variant="outline" onClick={handleBack}>
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Go Back
                                </Button>
                                <Button variant="outline" onClick={handleReset}>
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Start Over
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                ) : (
                    /* Question Card */
                    <motion.div
                        key={currentNodeId}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <Card className="p-6 lg:p-8">
                            {/* Question */}
                            <div className="mb-6">
                                <div className="flex items-start gap-3 mb-2">
                                    <HelpCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                                    <h2 className="text-xl font-semibold">{currentNode?.question}</h2>
                                </div>
                                {currentNode?.hint && (
                                    <p className="text-sm text-muted-foreground ml-9">
                                        💡 {currentNode.hint}
                                    </p>
                                )}
                            </div>

                            {/* Options */}
                            <div className="space-y-3">
                                {currentNode?.options.map((option, idx) => (
                                    <motion.button
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => handleOptionClick(option)}
                                        className="w-full p-4 text-left rounded-lg border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{option.label}</span>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center justify-between mt-6 pt-6 border-t">
                                <Button
                                    variant="ghost"
                                    onClick={handleBack}
                                    disabled={history.length <= 1}
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back
                                </Button>
                                <Button variant="ghost" onClick={handleReset}>
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Reset
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Link to all patterns */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-8"
            >
                <Link to="/patterns">
                    <Button variant="link" className="text-muted-foreground">
                        Or browse all patterns manually →
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
}
