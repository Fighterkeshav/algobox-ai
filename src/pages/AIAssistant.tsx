import React, { useState } from "react";
import { Send, Sparkles, Bot, User, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AIAssistant() {
    const [messages, setMessages] = useState<{ role: "ai" | "user"; content: string }[]>([
        { role: "ai", content: "Hello! I'm your AI Assistant. How can I help you today with your coding journey or algorithm practice?" }
    ]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { role: "user", content: input }]);
        setInput("");
        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: "ai", content: "I'm a simulated AI Assistant for now! My brain is still being connected to the Algobox neural network." }]);
        }, 1000);
    };

    return (
        <div className="h-full flex flex-col p-6 max-w-5xl mx-auto w-full gap-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        AI Assistant
                    </h1>
                    <p className="text-sm text-slate-400">Your personal coding mentor and problem-solving companion</p>
                </div>
            </div>

            <Card className="flex-1 overflow-hidden bg-slate-950/50 border-slate-800 shadow-2xl flex flex-col relative">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 z-10 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {messages.map((message, idx) => (
                        <div key={idx} className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${message.role === "ai" ? "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20" : "bg-gradient-to-br from-slate-600 to-slate-700"} `}>
                                {message.role === "ai" ? <Bot className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-white" />}
                            </div>
                            <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${message.role === "user" ? "bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/10" : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm"}`}>
                                <p className="leading-relaxed text-[15px]">{message.content}</p>
                            </div>
                        </div>
                    ))}
                    {messages.length % 2 === 0 && (
                        <div className="flex gap-4 items-center text-slate-500 text-sm italic animate-pulse">
                            <Cpu className="h-5 w-5" />
                            AI is thinking...
                        </div>
                    )}
                </div>

                <div className="p-4 bg-slate-900/80 border-t border-slate-800 backdrop-blur-md z-10">
                    <div className="relative flex items-center max-w-4xl mx-auto">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask any coding question or seek help with a problem..."
                            className="w-full bg-slate-950 border border-slate-700 rounded-full pl-6 pr-14 py-4 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner placeholder:text-slate-500"
                        />
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleSend}
                            className={`absolute right-2 h-10 w-10 rounded-full transition-all duration-300 ${input.trim() ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white" : "text-slate-500 hover:text-slate-400"}`}
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
