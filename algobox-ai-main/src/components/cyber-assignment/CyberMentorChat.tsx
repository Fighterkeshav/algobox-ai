import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Shield, Sparkles, User, Lightbulb } from "lucide-react";
import { SecurityChallenge } from "../cyber-practice/types";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

interface CyberMentorChatProps {
    challenge: SecurityChallenge;
}

export function CyberMentorChat({ challenge }: CyberMentorChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: `Hello! I'm your Security Mentor. You've been assigned to fix: **${challenge.title}**.\n\nDo you understand the vulnerability, or would you like me to explain how to patch it?`,
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simple mock response logic for now
        // TODO: Connect to real LLM
        setTimeout(() => {
            let reply = "That's an interesting approach. Have you considered checking the input validation?";

            const lowerInput = userMsg.content.toLowerCase();
            if (lowerInput.includes("hint") || lowerInput.includes("help") || lowerInput.includes("stuck")) {
                reply = `Here is a hint based on your current task:\n\n${challenge.hints[Math.floor(Math.random() * challenge.hints.length)]}`;
            } else if (lowerInput.includes("validate") || lowerInput.includes("sanitize")) {
                reply = "Yes! Validation is key. Remember to validate on the **server-side**, not just the client.";
            } else if (lowerInput.includes("param") || lowerInput.includes("query")) {
                reply = "Correct. Parameterized queries (or Prepared Statements) distinguish code from data, preventing the interpreter from executing malicious input.";
            }

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: reply,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <Card className="flex flex-col h-full bg-slate-900/50 border-slate-800">
            {/* Header */}
            <div className="p-3 border-b border-slate-800 flex items-center gap-2 bg-slate-950/30">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="font-semibold text-sm text-slate-200">AI Security Mentor</span>
                <Badge variant="secondary" className="ml-auto text-xs bg-purple-500/10 text-purple-300 border-purple-500/20">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Online
                </Badge>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-indigo-500/20" : "bg-purple-500/20"
                            }`}>
                            {msg.role === "user" ? <User className="w-4 h-4 text-indigo-400" /> : <Shield className="w-4 h-4 text-purple-400" />}
                        </div>
                        <div className={`rounded-lg p-3 max-w-[85%] text-sm leading-relaxed ${msg.role === "user"
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-800 text-slate-200 border border-slate-700"
                            }`}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                            <Shield className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/30">
                {/* Quick actions if needed */}
                <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-slate-400 border border-slate-700 rounded-full hover:bg-slate-800"
                        onClick={() => setInput("Give me a hint please.")}
                    >
                        <Lightbulb className="w-3 h-3 mr-1" />
                        Get Hint
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-slate-400 border border-slate-700 rounded-full hover:bg-slate-800"
                        onClick={() => setInput("Why is this code vulnerable?")}
                    >
                        Explain Vulnerability
                    </Button>
                </div>

                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-2"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask the mentor..."
                        className="bg-slate-900 border-slate-700 text-slate-200 focus-visible:ring-purple-500"
                    />
                    <Button type="submit" size="icon" className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0">
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </Card>
    );
}

// Helper component for Badge since it might not be exported with variant 'outline' correctly everywhere
function Badge({ variant, className, children, ...props }: any) {
    return <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`} {...props}>{children}</div>
}
