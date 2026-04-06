import React, { useState } from "react";
import { Bot, Send, Trash2, User, Loader2, Sparkles, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import GeneratingLoader from "@/components/ui/GeneratingLoader";

export default function AIAssistant() {
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const askAI = async (msg?: string) => {
    const message = msg || aiInput.trim();
    if (!message) return;
    setAiInput("");

    // Add user message
    setChatMessages((prev) => [...prev, { role: "user", content: message }]);
    setIsAiLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Use the Go Serverless API for AI requests
      const response = await fetch('/api/go/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || "anonymous",
          prompt: message,
          context: `General AI Assistant Query`
        })
      });

      if (!response.ok) throw new Error("AI Service Unavailable");

      const data = await response.json();

      setChatMessages((prev) => [...prev, {
        role: "assistant",
        content: `🤖 ${data.message || "I'm analyzing your request in the background."}`
      }]);

    } catch (err: any) {
      setChatMessages((prev) => [...prev, { role: "assistant", content: `Error: ${err?.message || "Failed to connect"}` }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const clearChat = () => setChatMessages([]);

  return (
    <div className="h-[calc(100vh-64px)] sm:h-screen flex flex-col bg-background">
      {/* Top Header */}
      <div className="border-b border-border px-4 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-none">AI Assistant</h1>
            <p className="text-xs text-muted-foreground mt-1">Your personal coding mentor and guide</p>
          </div>
        </div>
        {chatMessages.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearChat} className="h-8 text-xs">
            <Trash2 className="h-3.5 w-3.5 mr-2" />
            Clear Chat
          </Button>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-4xl mx-auto w-full">
        <ScrollArea className="flex-1">
          <div className="p-4 sm:p-6 space-y-6">
            {chatMessages.length === 0 ? (
              <div className="h-[50vh] flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">How can I help you today?</h2>
                <p className="text-muted-foreground text-sm">
                  I can help you understand algorithms, debug your code, review patterns, or guide you through learning concepts.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full mt-8">
                  {[
                    "Explain Dynamic Programming",
                    "How do I reverse a linked list?",
                    "What's the difference between BFS and DFS?",
                    "Review my sorting code"
                  ].map((hint, idx) => (
                    <Button 
                      key={idx} 
                      variant="outline" 
                      className="justify-start text-xs h-auto py-3 px-4 whitespace-normal text-left"
                      onClick={() => askAI(hint)}
                    >
                      <Lightbulb className="h-3.5 w-3.5 mr-2 text-amber-500 shrink-0" />
                      {hint}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div key={idx} className={cn("flex gap-3 sm:gap-4", msg.role === "user" ? "justify-end" : "justify-start")}>
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className={cn(
                    "max-w-[85%] rounded-xl px-4 py-3 shadow-sm",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-card border border-border rounded-tl-sm"
                  )}>
                    {msg.role === "user" ? (
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    ) : (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            code: ({ node, className, children, ...props }) => {
                              const isInline = !className;
                              return isInline ? (
                                <code className="bg-slate-800/50 px-1.5 py-0.5 rounded-md text-xs font-mono text-amber-200" {...props}>{children}</code>
                              ) : (
                                <pre className="bg-slate-900 border border-slate-800 p-4 rounded-xl overflow-x-auto text-sm my-3 shadow-inner">
                                  <code className="font-mono" {...props}>{children}</code>
                                </pre>
                              );
                            },
                            p: ({ children }) => <p className="mb-3 text-sm leading-relaxed last:mb-0">{children}</p>,
                            h3: ({ children }) => <h3 className="text-base font-semibold mt-4 mb-2">{children}</h3>,
                            ul: ({ children }) => <ul className="list-disc list-inside text-sm space-y-1 mb-3">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside text-sm space-y-1 mb-3">{children}</ol>,
                            strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))
            )}
            {isAiLoading && (
              <div className="flex gap-3 sm:gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-card border border-border rounded-xl rounded-tl-sm px-5 py-3 min-w-[100px] flex justify-center shadow-sm">
                  <GeneratingLoader className="scale-[0.5] origin-center m-0 h-8" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-background">
          <div className="relative">
            <Input
              placeholder="Ask me anything..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && askAI()}
              className="pl-4 pr-12 py-6 text-sm bg-card border-2 border-border focus-visible:ring-primary focus-visible:border-primary shadow-sm rounded-xl"
            />
            <Button 
              size="icon" 
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg" 
              onClick={() => askAI()} 
              disabled={isAiLoading || !aiInput.trim()}
            >
              {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-[10px] text-center text-muted-foreground mt-2">
            AI Assistant can make mistakes. Consider verifying important information.
          </p>
        </div>
      </div>
    </div>
  );
}
