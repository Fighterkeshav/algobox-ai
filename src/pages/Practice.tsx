import { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Play,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Send,
  Bot,
  User,
  Trash2,
  Eye,
  Search,
  Check,
  Filter,
  PanelLeftClose,
  PanelLeft,
  Code2,
  Terminal,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { D3CodeVisualization } from "@/components/visualisation/D3CodeVisualization";
import { PROBLEMS, Problem } from "@/lib/problems/problemLibrary";
import { supabase } from "@/integrations/supabase/client";

type Language = "python" | "javascript" | "cpp";

// LeetCode-style difficulty colors
const DIFFICULTY_CONFIG = {
  beginner: { label: "Easy", color: "text-[#00b8a3]", bg: "bg-[#00b8a3]/10" },
  intermediate: { label: "Med.", color: "text-[#ffc01e]", bg: "bg-[#ffc01e]/10" },
  advanced: { label: "Hard", color: "text-[#ff375f]", bg: "bg-[#ff375f]/10" },
};

export default function Practice() {
  // Problem selection
  const [selectedProblemId, setSelectedProblemId] = useState(PROBLEMS[0].id);
  const selectedProblem = PROBLEMS.find(p => p.id === selectedProblemId) || PROBLEMS[0];
  const [solvedProblems, setSolvedProblems] = useState<Set<string>>(new Set());

  // UI State
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);

  // Code editor
  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState(selectedProblem.starterCode["javascript"]);
  const [isRunning, setIsRunning] = useState(false);

  // Output
  const [activeOutputTab, setActiveOutputTab] = useState<"testcase" | "result" | "visualization">("testcase");
  const [testResults, setTestResults] = useState(selectedProblem.testCases.map(tc => ({ ...tc, passed: null as boolean | null })));
  const [visualizationData, setVisualizationData] = useState<any>(null);
  const [currentVisStep, setCurrentVisStep] = useState(0);

  // AI Chat
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [inputValue, setInputValue] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showHints, setShowHints] = useState<number[]>([]);

  // Filtered problems
  const filteredProblems = useMemo(() => {
    return PROBLEMS.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = !difficultyFilter || p.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });
  }, [searchQuery, difficultyFilter]);

  const handleProblemSelect = (problemId: string) => {
    const problem = PROBLEMS.find(p => p.id === problemId);
    if (problem) {
      setSelectedProblemId(problemId);
      setCode(problem.starterCode[language]);
      setTestResults(problem.testCases.map(tc => ({ ...tc, passed: null as boolean | null })));
      setVisualizationData(null);
      setShowHints([]);
    }
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setCode(selectedProblem.starterCode[newLang]);
    setVisualizationData(null);
  };

  const handleRun = async (visualize = false) => {
    setIsRunning(true);
    if (!visualize) {
      setActiveOutputTab("result");
    } else {
      setActiveOutputTab("visualization");
    }

    try {
      const testsPayload = testResults.map(t => ({ input: t.input, expected: t.expected }));
      const { data, error } = await supabase.functions.invoke("debug-code", {
        body: { code, language, tests: testsPayload, visualize },
      });

      if (error) throw error;

      if (visualize && data.visualization) {
        setVisualizationData(data.visualization);
        setCurrentVisStep(0);
      }

      if (data.execution?.tests) {
        const updatedResults = testResults.map((tr, idx) => ({
          ...tr,
          passed: data.execution.tests[idx]?.passed ?? null,
          output: data.execution.tests[idx]?.stdout ?? null,
        }));
        setTestResults(updatedResults);

        if (data.execution.passed) {
          setSolvedProblems(prev => new Set(prev).add(selectedProblemId));
          toast.success("All tests passed! 🎉");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Execution failed");
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(selectedProblem.starterCode[language]);
    setTestResults(selectedProblem.testCases.map(tc => ({ ...tc, passed: null })));
    setVisualizationData(null);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isAiLoading) return;
    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInputValue("");
    setIsAiLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("debug-code", {
        body: { code, language, userQuestion: userMsg, skipAnalysis: false },
      });
      if (error) throw error;
      setMessages(prev => [...prev, { role: "assistant", content: data.analysis || "No response." }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: "assistant", content: `Error: ${err?.message}` }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const toggleHint = (index: number) => {
    setShowHints(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };

  return (
    <div className="h-screen bg-[#1a1a1a] flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="h-12 bg-[#282828] border-b border-[#3e3e3e] flex items-center px-4 gap-4">
        <button
          onClick={() => setLeftPanelOpen(!leftPanelOpen)}
          className="text-slate-400 hover:text-white p-1"
        >
          {leftPanelOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
        </button>
        <span className="text-white font-semibold">Problem List</span>
        <span className="text-slate-500 text-sm">
          {solvedProblems.size}/{PROBLEMS.length} Solved
        </span>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          {(["javascript", "python", "cpp"] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={cn(
                "px-3 py-1 text-sm rounded transition-colors",
                language === lang
                  ? "bg-[#3e3e3e] text-white"
                  : "text-slate-400 hover:text-white"
              )}
            >
              {lang === "cpp" ? "C++" : lang.charAt(0).toUpperCase() + lang.slice(1)}
            </button>
          ))}
        </div>
        <Button
          onClick={() => handleRun(false)}
          disabled={isRunning}
          size="sm"
          className="bg-[#2cbb5d] hover:bg-[#28a853] text-white"
        >
          <Play className="w-4 h-4 mr-1" />
          Run
        </Button>
        <Button
          onClick={() => handleRun(true)}
          disabled={isRunning}
          size="sm"
          variant="outline"
          className="border-[#3e3e3e] text-slate-300 hover:bg-[#3e3e3e]"
        >
          <Eye className="w-4 h-4 mr-1" />
          Visualize
        </Button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Problem List */}
        <AnimatePresence>
          {leftPanelOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-[#282828] border-r border-[#3e3e3e] flex flex-col overflow-hidden"
            >
              {/* Search */}
              <div className="p-3 border-b border-[#3e3e3e]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search questions"
                    className="pl-9 bg-[#1a1a1a] border-[#3e3e3e] text-white placeholder:text-slate-500"
                  />
                </div>
                {/* Difficulty Filter */}
                <div className="flex gap-2 mt-2">
                  {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setDifficultyFilter(difficultyFilter === key ? null : key)}
                      className={cn(
                        "px-2 py-1 text-xs rounded transition-colors",
                        difficultyFilter === key
                          ? `${config.bg} ${config.color}`
                          : "text-slate-400 hover:text-white"
                      )}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Problem List */}
              <div className="flex-1 overflow-y-auto">
                {filteredProblems.map((problem, idx) => {
                  const isSolved = solvedProblems.has(problem.id);
                  const isSelected = problem.id === selectedProblemId;
                  const config = DIFFICULTY_CONFIG[problem.difficulty];

                  return (
                    <button
                      key={problem.id}
                      onClick={() => handleProblemSelect(problem.id)}
                      className={cn(
                        "w-full px-4 py-3 flex items-center gap-3 text-left border-b border-[#3e3e3e]/50 transition-colors",
                        isSelected ? "bg-[#3e3e3e]" : "hover:bg-[#323232]"
                      )}
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        {isSolved ? (
                          <Check className="w-4 h-4 text-[#00b8a3]" />
                        ) : (
                          <span className="text-slate-500 text-sm">{idx + 1}</span>
                        )}
                      </div>
                      <span className={cn("flex-1 text-sm", isSelected ? "text-white" : "text-slate-300")}>
                        {problem.title}
                      </span>
                      <span className={cn("text-xs font-medium", config.color)}>
                        {config.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center: Code Editor + Output */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ResizablePanelGroup direction="vertical">
            {/* Code Editor */}
            <ResizablePanel defaultSize={60} minSize={30}>
              <div className="h-full flex flex-col bg-[#1e1e1e]">
                <div className="h-10 px-4 flex items-center justify-between bg-[#282828] border-b border-[#3e3e3e]">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-[#ffc01e]" />
                    <span className="text-sm text-slate-300">Code</span>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                </div>
                <div className="flex-1">
                  <Editor
                    height="100%"
                    language={language === "cpp" ? "cpp" : language}
                    value={code}
                    onChange={(val) => setCode(val || "")}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 4,
                      padding: { top: 16 },
                    }}
                  />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle className="h-1 bg-[#3e3e3e]" />

            {/* Output Panel */}
            <ResizablePanel defaultSize={40} minSize={20}>
              <div className="h-full flex flex-col bg-[#282828]">
                <div className="h-10 px-2 flex items-center border-b border-[#3e3e3e]">
                  <button
                    onClick={() => setActiveOutputTab("testcase")}
                    className={cn(
                      "px-3 py-1 text-sm rounded transition-colors",
                      activeOutputTab === "testcase" ? "bg-[#3e3e3e] text-white" : "text-slate-400"
                    )}
                  >
                    Testcase
                  </button>
                  <button
                    onClick={() => setActiveOutputTab("result")}
                    className={cn(
                      "px-3 py-1 text-sm rounded transition-colors",
                      activeOutputTab === "result" ? "bg-[#3e3e3e] text-white" : "text-slate-400"
                    )}
                  >
                    Test Result
                  </button>
                  <button
                    onClick={() => setActiveOutputTab("visualization")}
                    className={cn(
                      "px-3 py-1 text-sm rounded transition-colors",
                      activeOutputTab === "visualization" ? "bg-[#3e3e3e] text-white" : "text-slate-400"
                    )}
                  >
                    Visualization
                  </button>
                </div>

                <div className="flex-1 overflow-auto p-4">
                  {activeOutputTab === "testcase" && (
                    <div className="space-y-3">
                      {testResults.map((tc, idx) => (
                        <div key={idx} className="bg-[#1a1a1a] rounded-lg p-3">
                          <div className="text-xs text-slate-500 mb-1">Case {idx + 1}</div>
                          <div className="font-mono text-sm text-slate-300">
                            <span className="text-slate-500">Input:</span> {tc.input}
                          </div>
                          <div className="font-mono text-sm text-slate-300">
                            <span className="text-slate-500">Expected:</span> {tc.expected}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeOutputTab === "result" && (
                    <div className="space-y-3">
                      {testResults.map((tc, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "rounded-lg p-3 border",
                            tc.passed === true ? "bg-[#00b8a3]/10 border-[#00b8a3]/30" :
                              tc.passed === false ? "bg-[#ff375f]/10 border-[#ff375f]/30" :
                                "bg-[#1a1a1a] border-[#3e3e3e]"
                          )}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {tc.passed === true && <Check className="w-4 h-4 text-[#00b8a3]" />}
                            {tc.passed === false && <span className="text-[#ff375f]">✗</span>}
                            <span className="text-sm text-white">Test Case {idx + 1}</span>
                            {tc.passed === true && <span className="text-xs text-[#00b8a3]">Passed</span>}
                            {tc.passed === false && <span className="text-xs text-[#ff375f]">Failed</span>}
                          </div>
                          <div className="font-mono text-xs text-slate-400">
                            Input: {tc.input}
                          </div>
                          <div className="font-mono text-xs text-slate-400">
                            Expected: {tc.expected}
                          </div>
                          {(tc as any).output && (
                            <div className="font-mono text-xs text-slate-300 mt-1">
                              Output: {(tc as any).output}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {activeOutputTab === "visualization" && (
                    <div className="h-full">
                      {visualizationData?.steps?.length > 0 ? (
                        <div className="h-full flex flex-col">
                          <D3CodeVisualization step={visualizationData.steps[currentVisStep]} />
                          <div className="flex items-center justify-center gap-4 mt-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setCurrentVisStep(Math.max(0, currentVisStep - 1))}
                              disabled={currentVisStep === 0}
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <span className="text-sm text-slate-400">
                              Step {currentVisStep + 1} / {visualizationData.steps.length}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setCurrentVisStep(Math.min(visualizationData.steps.length - 1, currentVisStep + 1))}
                              disabled={currentVisStep >= visualizationData.steps.length - 1}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-500">
                          <p>Click "Visualize" to see step-by-step execution</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Right Panel: Problem Description + AI */}
        <div className="w-96 bg-[#282828] border-l border-[#3e3e3e] flex flex-col overflow-hidden">
          <Tabs defaultValue="description" className="flex-1 flex flex-col">
            <TabsList className="h-10 rounded-none bg-transparent border-b border-[#3e3e3e] px-2 justify-start">
              <TabsTrigger value="description" className="data-[state=active]:bg-[#3e3e3e] rounded text-sm">
                Description
              </TabsTrigger>
              <TabsTrigger value="hints" className="data-[state=active]:bg-[#3e3e3e] rounded text-sm">
                <Lightbulb className="w-3 h-3 mr-1" />
                Hints
              </TabsTrigger>
              <TabsTrigger value="ai" className="data-[state=active]:bg-[#3e3e3e] rounded text-sm">
                <Bot className="w-3 h-3 mr-1" />
                AI
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="flex-1 overflow-auto p-4 mt-0">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-semibold text-white">{selectedProblem.title}</h2>
                <Badge className={cn("text-xs", DIFFICULTY_CONFIG[selectedProblem.difficulty].bg, DIFFICULTY_CONFIG[selectedProblem.difficulty].color)}>
                  {DIFFICULTY_CONFIG[selectedProblem.difficulty].label}
                </Badge>
              </div>

              <div className="prose prose-invert prose-sm max-w-none">
                <div className="text-slate-300 whitespace-pre-wrap text-sm">{selectedProblem.description}</div>

                <h4 className="text-white mt-6 mb-3 text-sm font-semibold">Examples</h4>
                {selectedProblem.examples.map((ex, i) => (
                  <div key={i} className="bg-[#1a1a1a] rounded-lg p-3 mb-3 font-mono text-xs">
                    <div className="text-slate-400">Input: <span className="text-slate-200">{ex.input}</span></div>
                    <div className="text-slate-400">Output: <span className="text-slate-200">{ex.output}</span></div>
                    {ex.explanation && <div className="text-slate-500 mt-2">{ex.explanation}</div>}
                  </div>
                ))}

                <h4 className="text-white mt-6 mb-3 text-sm font-semibold">Constraints</h4>
                <ul className="text-slate-400 text-xs space-y-1 font-mono">
                  {selectedProblem.constraints.map((c, i) => (
                    <li key={i}>• {c}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="hints" className="flex-1 overflow-auto p-4 mt-0">
              <div className="space-y-3">
                {selectedProblem.hints.map((hint, i) => (
                  <div key={i} className="bg-[#1a1a1a] rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleHint(i)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#232323]"
                    >
                      <span className="text-sm text-slate-300">Hint {i + 1}</span>
                      <Lightbulb className={cn("w-4 h-4", showHints.includes(i) ? "text-[#ffc01e]" : "text-slate-500")} />
                    </button>
                    <AnimatePresence>
                      {showHints.includes(i) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-3"
                        >
                          <p className="text-sm text-[#ffc01e]">{hint}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ai" className="flex-1 flex flex-col mt-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-slate-500 py-8">
                    <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Ask AI for help with this problem</p>
                    <p className="text-xs mt-1 text-slate-600">I'll guide you without giving away the answer</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex gap-2",
                        msg.role === "user" ? "flex-row-reverse" : ""
                      )}
                    >
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                        msg.role === "user" ? "bg-[#00b8a3]" : "bg-[#ffc01e]"
                      )}>
                        {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-black" />}
                      </div>
                      <div className={cn(
                        "max-w-[80%] px-3 py-2 rounded-lg text-sm",
                        msg.role === "user" ? "bg-[#00b8a3] text-white" : "bg-[#1a1a1a] text-slate-300"
                      )}>
                        <ReactMarkdown className="prose prose-invert prose-sm">{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  ))
                )}
                {isAiLoading && (
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#ffc01e] flex items-center justify-center">
                      <Bot className="w-4 h-4 text-black" />
                    </div>
                    <div className="bg-[#1a1a1a] px-3 py-2 rounded-lg">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-[#3e3e3e]">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Ask a question..."
                    className="bg-[#1a1a1a] border-[#3e3e3e] text-white"
                  />
                  <Button onClick={sendMessage} disabled={isAiLoading} size="icon" className="bg-[#00b8a3] hover:bg-[#00a393]">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
