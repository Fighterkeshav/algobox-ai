import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, User, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function AIAssistant() {
    const [messages, setMessages] = useState<{ role: "ai" | "user"; content: string }[]>([
        { role: "ai", content: "Hello! I'm your AI Assistant. How can I help you today with your coding journey or algorithm practice?" }
    ]);
    const [input, setInput] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        const context = messages.map(m => `${m.role === 'ai' ? 'AI' : 'User'}: ${m.content}`).join("\n");

        try {
            const { data, error } = await supabase.functions.invoke("ask-ai", {
                body: { prompt: userMessage, context }
            });

            if (error) {
                console.error("API error:", error);
                setMessages(prev => [...prev, { role: "ai", content: "I'm sorry, I'm having trouble connecting to my neural network. Please check your connection." }]);
            } else if (data?.error) {
                setMessages(prev => [...prev, { role: "ai", content: `Error: ${data.error}` }]);
            } else {
                setMessages(prev => [...prev, { role: "ai", content: data.message || "I couldn't process that request." }]);
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setMessages(prev => [...prev, { role: "ai", content: "An unexpected error occurred. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col p-6 max-w-5xl mx-auto w-full gap-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                    <Sparkles className="h-5 w-5 text-slate-300" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        AI Assistant
                    </h1>
                    <p className="text-sm text-slate-400">Your personal coding mentor and problem-solving companion</p>
                </div>
            </div>

            <Card className="flex-1 overflow-hidden bg-[#020617] border-slate-800 shadow-2xl flex flex-col relative">

                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 z-10 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {messages.map((message, idx) => (
                        <div key={idx} className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border ${message.role === "ai" ? "bg-slate-900 border-slate-800" : "bg-slate-800 border-slate-700"} `}>
                                {message.role === "ai" ? <Bot className="h-4 w-4 text-slate-300" /> : <User className="h-4 w-4 text-slate-300" />}
                            </div>
                            <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${message.role === "user" ? "bg-slate-800 border border-slate-700 text-slate-100 rounded-tr-none shadow-sm" : "bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none shadow-sm"}`}>
                                {message.role === "user" ? (
                                    <p className="leading-relaxed text-[15px] whitespace-pre-wrap">{message.content}</p>
                                ) : (
                                    <div className="prose prose-invert prose-p:leading-relaxed prose-pre:p-0 max-w-none text-[15px]">
                                        <ReactMarkdown
                                            components={{
                                                code({ node, inline, className, children, ...props }: any) {
                                                    const match = /language-(\w+)/.exec(className || '');
                                                    return !inline && match ? (
                                                        <SyntaxHighlighter
                                                            style={vscDarkPlus as any}
                                                            language={match[1]}
                                                            PreTag="div"
                                                            className="rounded-md border border-slate-700 !my-4 !bg-[#0d1117]"
                                                            {...props}
                                                        >
                                                            {String(children).replace(/\n$/, '')}
                                                        </SyntaxHighlighter>
                                                    ) : (
                                                        <code className="bg-slate-800 px-1.5 py-0.5 rounded-md text-indigo-300" {...props}>
                                                            {children}
                                                        </code>
                                                    )
                                                }
                                            }}
                                        >
                                            {message.content}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-4 items-center text-slate-500 text-sm italic animate-pulse">
                            <Cpu className="h-5 w-5" />
                            AI is thinking...
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-[#020617] border-t border-slate-800 z-10">
                    <div className="relative flex items-center max-w-4xl mx-auto">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask any coding question or seek help with a problem..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-full pl-6 pr-14 py-4 text-sm text-slate-200 focus:outline-none focus:border-slate-600 shadow-inner placeholder:text-slate-500"
                        />
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleSend}
                            className={`absolute right-2 h-10 w-10 rounded-full transition-all duration-300 ${input.trim() ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:text-white" : "text-slate-500 hover:text-slate-400"}`}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="text-center mt-3 text-xs text-slate-500">
                        AI Assistant can make mistakes. Verify important information.
                    </div>
                </div>
            </Card>
        </div>
    );
}
