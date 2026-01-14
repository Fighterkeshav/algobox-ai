import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Lock,
  Play,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useRoadmap } from "@/hooks/useRoadmap";
import { useProgress } from "@/hooks/useProgress";
import { supabase } from "@/integrations/supabase/client";
import { PROBLEMS } from "@/lib/problems/problemLibrary";
import { toast } from "sonner";

interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  skills: string[];
  type?: "visual-algorithm";
  algorithmId?: string;
  children?: RoadmapNode[];
  relatedTags?: string[];
}

const roadmapData: RoadmapNode[] = [
  {
    id: "fundamentals",
    title: "Programming Fundamentals",
    description: "Core concepts every developer needs",
    difficulty: "beginner",
    estimatedTime: "2 weeks",
    skills: ["Variables", "Loops", "Functions", "Conditionals"],
    children: [
      {
        id: "variables",
        title: "Variables & Data Types",
        description: "Understanding how to store and manipulate data",
        difficulty: "beginner",
        estimatedTime: "2 days",
        skills: ["Primitives", "Objects", "Type Coercion"],
      },
      {
        id: "control-flow",
        title: "Control Flow",
        description: "Conditionals, loops, and program flow",
        difficulty: "beginner",
        estimatedTime: "3 days",
        skills: ["If/Else", "Switch", "For/While Loops"],
        relatedTags: ["Simulation"],
      },
      {
        id: "functions",
        title: "Functions & Scope",
        description: "Writing reusable code blocks",
        difficulty: "beginner",
        estimatedTime: "4 days",
        skills: ["Parameters", "Return Values", "Closures"],
      },
    ],
  },
  {
    id: "data-structures",
    title: "Data Structures",
    description: "Essential data organization patterns",
    difficulty: "intermediate",
    estimatedTime: "4 weeks",
    skills: ["Arrays", "Linked Lists", "Trees", "Hash Tables"],
    children: [
      {
        id: "arrays",
        title: "Arrays & Strings",
        description: "Sequential data storage and manipulation",
        difficulty: "beginner",
        estimatedTime: "1 week",
        skills: ["Two Pointers", "Sliding Window", "Prefix Sum"],
        relatedTags: ["Array", "String", "Two Pointers"],
      },
      {
        id: "linked-lists",
        title: "Linked Lists",
        description: "Dynamic sequential data structures",
        difficulty: "intermediate",
        estimatedTime: "5 days",
        skills: ["Singly Linked", "Doubly Linked", "Fast/Slow Pointers"],
        relatedTags: ["Linked List"],
      },
      {
        id: "trees",
        title: "Trees & Graphs",
        description: "Hierarchical and network data structures",
        difficulty: "intermediate",
        estimatedTime: "2 weeks",
        skills: ["Binary Trees", "BST", "Graph Traversal"],
        relatedTags: ["Tree", "Graph", "Depth-First Search", "Breadth-First Search"],
      },
      {
        id: "hash",
        title: "Hash Tables",
        description: "Key-value storage for fast lookups",
        difficulty: "intermediate",
        estimatedTime: "4 days",
        skills: ["Hashing", "Collision Resolution", "Sets/Maps"],
        relatedTags: ["Hash Table"],
      },
    ],
  },
  {
    id: "algorithms",
    title: "Algorithm Patterns",
    description: "Problem-solving techniques and patterns",
    difficulty: "advanced",
    estimatedTime: "6 weeks",
    skills: ["Sorting", "Searching", "Dynamic Programming", "Greedy"],
    children: [
      {
        id: "sorting",
        title: "Sorting Algorithms",
        description: "Organize data efficiently",
        difficulty: "intermediate",
        estimatedTime: "1 week",
        skills: ["QuickSort", "MergeSort", "HeapSort"],
        children: [
          {
            id: "quick-sort",
            title: "Quick Sort",
            description: "Fast divide-and-conquer sorting",
            difficulty: "intermediate",
            estimatedTime: "2 days",
            skills: ["Partitioning", "Recursion"],
            type: "visual-algorithm",
            algorithmId: "quick-sort",
            relatedTags: ["Sorting"],
          },
        ],
      },
      {
        id: "binary-search",
        title: "Binary Search",
        description: "Divide and conquer for sorted data",
        difficulty: "intermediate",
        estimatedTime: "5 days",
        skills: ["Search Space", "Bounds", "Rotated Arrays"],
        relatedTags: ["Binary Search"],
      },
      {
        id: "dp",
        title: "Dynamic Programming",
        description: "Optimal substructure solutions",
        difficulty: "advanced",
        estimatedTime: "3 weeks",
        skills: ["Memoization", "Tabulation", "State Design"],
        relatedTags: ["Dynamic Programming"],
      },
    ],
  },
];

export default function Roadmap() {
  const [expandedNodes, setExpandedNodes] = useState<string[]>(["fundamentals", "data-structures"]);
  const { isTopicCompleted, toggleTopicCompletion } = useRoadmap();
  const { progress } = useProgress();
  const [customRoadmap, setCustomRoadmap] = useState<RoadmapNode[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const displayRoadmap = customRoadmap || roadmapData;

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-study-plan', {
        body: {
          progressData: progress
        }
      });

      if (error) throw error;
      if (data.roadmap) {
        setCustomRoadmap(data.roadmap);
        toast.success("Personalized plan generated!", {
          description: "Your roadmap has been updated based on your progress."
        });
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

  const getNodeStatus = (node: RoadmapNode) => {
    if (node.children) {
      const childrenStatus = node.children.map(child => getNodeStatus(child));
      const completedCount = childrenStatus.filter(s => s.status === "completed").length;
      const progress = node.children.length > 0 ? Math.round((completedCount / node.children.length) * 100) : 0;

      const status = progress === 100 ? "completed" : "in-progress";
      return { status, progress, totalProblems: 0, solvedProblems: 0 };
    }

    if (node.relatedTags && node.relatedTags.length > 0) {
      const matchingProblems = PROBLEMS.filter(p =>
        p.tags.some(tag => node.relatedTags?.includes(tag))
      );

      if (matchingProblems.length > 0) {
        const solvedCount = matchingProblems.filter(p => progress[p.id]?.status === "solved").length;
        const totalCount = matchingProblems.length;
        const calculatedProgress = Math.round((solvedCount / totalCount) * 100);

        return {
          status: calculatedProgress === 100 ? "completed" : "in-progress",
          progress: calculatedProgress,
          totalProblems: totalCount,
          solvedProblems: solvedCount,
          isAutomated: true
        };
      }
    }

    const isCompleted = isTopicCompleted(node.id);
    return {
      status: isCompleted ? "completed" : "in-progress",
      progress: isCompleted ? 100 : 0,
      isAutomated: false
    };
  };

  return (
    <div className="p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold lg:text-3xl">Your Learning Roadmap</h1>
            <Badge variant="info" className="gap-1">
              <Sparkles className="h-3 w-3" />
              {customRoadmap ? "Personalized" : "Standard Path"}
            </Badge>
          </div>
          <Button
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            variant="outline"
            className="gap-2"
          >
            {isGenerating ? (
              <>Building Plan...</>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-primary" />
                Generate AI Plan
              </>
            )}
          </Button>
        </div>
        <p className="text-muted-foreground">
          A tailored path to mastery based on your goals and skill level
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {displayRoadmap.map((node, index) => (
          <RoadmapNodeCard
            key={node.id}
            node={node}
            isExpanded={expandedNodes.includes(node.id)}
            onToggle={() => toggleNode(node.id)}
            delay={index * 0.1}
            getNodeStatus={getNodeStatus}
            onToggleCompletion={toggleTopicCompletion}
          />
        ))}
      </motion.div>
    </div>
  );
}

interface RoadmapNodeCardProps {
  node: RoadmapNode;
  isExpanded: boolean;
  onToggle: () => void;
  delay?: number;
  isChild?: boolean;
  getNodeStatus: (node: RoadmapNode) => { status: string; progress: number; totalProblems?: number; solvedProblems?: number; isAutomated?: boolean };
  onToggleCompletion: (id: string, completed: boolean) => void;
}

function RoadmapNodeCard({ node, isExpanded, onToggle, delay = 0, isChild = false, getNodeStatus, onToggleCompletion }: RoadmapNodeCardProps) {
  const { status, progress, totalProblems, solvedProblems, isAutomated } = getNodeStatus(node);

  const statusIcon = {
    completed: <CheckCircle2 className="h-5 w-5 text-success" />,
    "in-progress": <Play className="h-5 w-5 text-warning" />,
    locked: <Lock className="h-5 w-5 text-muted-foreground" />,
  };

  const statusColors = {
    completed: "border-success/30 bg-success/5",
    "in-progress": "border-warning/30 bg-warning/5",
    locked: "border-border bg-muted/20",
  };

  // @ts-ignore
  const activeColor = statusColors[status] || statusColors["in-progress"];

  // Recursive helper to find the first leaf node's link
  const getStartLink = (node: RoadmapNode): string => {
    if (!node.children || node.children.length === 0) {
      if (node.type === "visual-algorithm") {
        return `/visualise/${node.algorithmId}`;
      }
      const query = node.relatedTags?.join(",") || encodeURIComponent(node.title);
      return node.relatedTags?.length ? `/practice?tags=${query}` : `/practice?search=${query}`;
    }

    for (const child of node.children) {
      const { status } = getNodeStatus(child);
      if (status !== 'completed') {
        return getStartLink(child);
      }
    }
    return getStartLink(node.children[0]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: isChild ? 20 : 0, y: isChild ? 0 : 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay }}
      className={cn(
        "rounded-xl border transition-all duration-300",
        activeColor,
        isChild ? "ml-6 mt-3" : ""
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between p-4 cursor-pointer",
          node.children && "hover:bg-accent/5"
        )}
        onClick={node.children ? onToggle : undefined}
      >
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0" onClick={(e) => {
            if (!node.children) {
              e.stopPropagation();
              if (isAutomated && totalProblems && totalProblems > 0) {
                toast.info(`Keep solving! You've completed ${solvedProblems} of ${totalProblems} problems.`, {
                  description: "This topic tracks your practice progress automatically."
                });
              } else {
                onToggleCompletion(node.id, status !== "completed");
              }
            }
          }}>
            {/* @ts-ignore */}
            {statusIcon[status]}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={cn(
                "font-semibold",
                status === "locked" && "text-muted-foreground"
              )}>
                {node.title}
              </h3>
              <Badge variant={node.difficulty}>{node.difficulty}</Badge>
              {isAutomated && (
                <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-background/50">
                  {solvedProblems}/{totalProblems}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{node.description}</p>

            {status !== "locked" && (
              <div className="flex items-center gap-3">
                <Progress value={progress} className="w-32 h-1.5" />
                <span className="text-xs text-muted-foreground">{progress}%</span>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5 mt-2">
              {node.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    status === "locked"
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary/10 text-primary"
                  )}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-muted-foreground">{node.estimatedTime}</div>
          </div>

          {status !== "locked" && (
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <Link to={getStartLink(node)}>
                <Button variant="outline" size="sm">
                  {status === "completed" ? "Review" : (node.children ? "Continue" : "Start")}
                </Button>
              </Link>
            </div>
          )}

          {node.children && (
            <div className="text-muted-foreground">
              {isExpanded ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </div>
          )}
        </div>
      </div>

      {node.children && isExpanded && (
        <div className="pb-4 pr-4">
          {node.children.map((child, index) => (
            <RoadmapNodeCard
              key={child.id}
              node={child}
              isExpanded={false}
              onToggle={() => { }}
              delay={index * 0.05}
              isChild
              getNodeStatus={getNodeStatus}
              onToggleCompletion={onToggleCompletion}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
