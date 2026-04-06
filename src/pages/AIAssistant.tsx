import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, User, Square, Cpu, ArrowUp, Code2, Lightbulb, BookOpen, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";

type Message = { role: "ai" | "user"; content: string };

const SUGGESTED_PROMPTS = [
  { icon: <Code2 className="h-4 w-4" />, text: "Explain Big O notation with examples" },
  { icon: <Lightbulb className="h-4 w-4" />, text: "How do I solve Two Sum optimally?" },
  { icon: <BookOpen className="h-4 w-4" />, text: "Walk me through Binary Search" },
  { icon: <Zap className="h-4 w-4" />, text: "What is dynamic programming?" },
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1 px-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-2 w-2 rounded-full bg-slate-400"
          style={{
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const handleSend = async (override?: string) => {
    const userMessage = (override ?? input).trim();
    if (!userMessage || isLoading) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    const context = messages.map(m => `${m.role === "ai" ? "AI" : "User"}: ${m.content}`).join("\n");

    try {
      const { data, error } = await supabase.functions.invoke("ask-ai", {
        body: { prompt: userMessage, context },
      });

      if (error || data?.error) {
        const msg = data?.error || "I'm having trouble connecting. Please try again.";
        setMessages(prev => [...prev, { role: "ai", content: msg }]);
      } else {
        setMessages(prev => [...prev, { role: "ai", content: data.message || "No response." }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: "ai", content: "An unexpected error occurred. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full bg-[#0a0f1e] text-white relative">

      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white">AlgoBox AI</h1>
          <p className="text-xs text-slate-400">Powered by Llama 3.3 · 70B</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-400">Online</span>
        </div>
      </div>

      {/* Messages / Empty State */}
      <div className="flex-1 overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
        {isEmpty ? (
          /* ── Empty State ── */
          <div className="flex flex-col items-center justify-center h-full gap-8 px-4 pb-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-indigo-500/30">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">How can I help you today?</h2>
              <p className="text-slate-400 text-sm max-w-sm">
                Your personal coding mentor. Ask me anything about algorithms, data structures, or problem-solving.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p.text}
                  onClick={() => handleSend(p.text)}
                  className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/15 p-4 text-left transition-all duration-200 group"
                >
                  <div className="mt-0.5 shrink-0 text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    {p.icon}
                  </div>
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors leading-snug">
                    {p.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ── Message Thread ── */
          <div className="max-w-3xl mx-auto w-full px-4 py-6 flex flex-col gap-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                {/* Avatar */}
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                  msg.role === "ai"
                    ? "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/20"
                    : "bg-white/10 border border-white/10"
                )}>
                  {msg.role === "ai"
                    ? <Bot className="h-4 w-4 text-white" />
                    : <User className="h-4 w-4 text-slate-300" />}
                </div>

                {/* Bubble */}
                <div className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-sm"
                    : "bg-white/[0.06] border border-white/8 text-slate-200 rounded-tl-sm"
                )}>
                  {msg.role === "user" ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none
                      prose-p:leading-relaxed prose-p:my-1
                      prose-h1:text-base prose-h1:font-bold prose-h1:mb-2
                      prose-h2:text-sm prose-h2:font-semibold prose-h2:mb-1
                      prose-h3:text-sm prose-h3:font-semibold prose-h3:mb-1
                      prose-ul:my-1 prose-ol:my-1 prose-li:my-0
                      prose-strong:text-indigo-300
                      prose-pre:p-0 prose-pre:bg-transparent prose-pre:my-2">
                      <ReactMarkdown
                        components={{
                          code({ node, inline, className, children, ...props }: any) {
                            const match = /language-(\w+)/.exec(className || "");
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={vscDarkPlus as any}
                                language={match[1]}
                                PreTag="div"
                                className="!rounded-xl !border !border-white/10 !my-3 !text-xs"
                                customStyle={{ background: "#0d1117", padding: "1rem" }}
                                {...props}
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            ) : (
                              <code className="bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 mt-1 shadow-md shadow-indigo-500/20">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white/[0.06] border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3">
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="px-4 pb-4 pt-3 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className={cn(
            "relative flex items-end gap-3 rounded-2xl border px-4 py-3 transition-all duration-200",
            input.length > 0 || isLoading
              ? "border-indigo-500/50 bg-white/[0.04] shadow-lg shadow-indigo-500/10"
              : "border-white/10 bg-white/[0.03] hover:border-white/20"
          )}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about algorithms, data structures, or code..."
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none leading-relaxed max-h-[200px] overflow-y-auto py-0.5"
              style={{ scrollbarWidth: "none" }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={cn(
                "shrink-0 h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-200",
                input.trim() && !isLoading
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/30 scale-100"
                  : "bg-white/5 text-slate-600 cursor-not-allowed scale-95"
              )}
            >
              {isLoading
                ? <Square className="h-3.5 w-3.5 fill-current" />
                : <ArrowUp className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-center text-[11px] text-slate-600 mt-2">
            AlgoBox AI uses the Socratic method — it guides, not spoils.
          </p>
        </div>
      </div>
    </div>
  );
}
