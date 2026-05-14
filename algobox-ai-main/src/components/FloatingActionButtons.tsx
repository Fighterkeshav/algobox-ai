import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    FileText,
    HelpCircle,
    X,
    Send,
    Sparkles,
    BookOpen,
    Target,
    MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface FloatingActionButtonsProps {
    className?: string;
}

export function FloatingActionButtons({ className }: FloatingActionButtonsProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showNote, setShowNote] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [noteText, setNoteText] = useState("");
    const [noteSaved, setNoteSaved] = useState(false);
    const location = useLocation();
    const { user } = useAuth();

    // Hide on certain pages
    const hiddenPaths = ["/", "/login", "/signup"];
    if (hiddenPaths.includes(location.pathname)) {
        return null;
    }

    const handleSaveNote = () => {
        if (!noteText.trim()) return;

        // Get existing notes from localStorage
        const existingNotes = JSON.parse(localStorage.getItem("quickNotes") || "[]");

        const newNote = {
            id: Date.now(),
            text: noteText,
            createdAt: new Date().toISOString(),
            page: location.pathname,
        };

        localStorage.setItem("quickNotes", JSON.stringify([newNote, ...existingNotes]));

        setNoteSaved(true);
        setTimeout(() => {
            setNoteSaved(false);
            setNoteText("");
            setShowNote(false);
        }, 1500);
    };

    const quickLinks = [
        {
            icon: <BookOpen className="h-4 w-4" />,
            label: "Patterns",
            href: "/patterns",
            description: "Browse algorithm patterns",
        },
        {
            icon: <Target className="h-4 w-4" />,
            label: "Algorithm Picker",
            href: "/algorithm-picker",
            description: "Find the right algorithm",
        },
        {
            icon: <FileText className="h-4 w-4" />,
            label: "Cheat Sheets",
            href: "/cheat-sheets",
            description: "Quick reference guides",
        },
    ];

    return (
        <div className={cn("fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3", className)}>
            <AnimatePresence>
                {/* Quick Note Popup */}
                {showNote && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="bg-card border rounded-xl shadow-lg p-4 w-72"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <FileText className="h-4 w-4 text-primary" />
                                Quick Note
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => setShowNote(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <Textarea
                            placeholder="Type your note here..."
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            className="min-h-[100px] mb-3 resize-none"
                        />
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                                Saved to Notes page
                            </span>
                            <Button
                                size="sm"
                                onClick={handleSaveNote}
                                disabled={!noteText.trim()}
                                className="gap-1"
                            >
                                {noteSaved ? (
                                    <>
                                        <Sparkles className="h-3 w-3" />
                                        Saved!
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-3 w-3" />
                                        Save
                                    </>
                                )}
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Help Popup */}
                {showHelp && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="bg-card border rounded-xl shadow-lg p-4 w-72"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <HelpCircle className="h-4 w-4 text-primary" />
                                Need Help?
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => setShowHelp(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {quickLinks.map((link) => (
                                <Link key={link.href} to={link.href} onClick={() => setShowHelp(false)}>
                                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group">
                                        <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            {link.icon}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">{link.label}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {link.description}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-3 pt-3 border-t">
                            <Link to="/practice" onClick={() => setShowHelp(false)}>
                                <Button variant="outline" size="sm" className="w-full gap-2">
                                    <MessageSquare className="h-4 w-4" />
                                    Ask AI Assistant
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}

                {/* Expanded Action Buttons */}
                {isExpanded && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Button
                                variant={showNote ? "default" : "secondary"}
                                size="icon"
                                className="h-12 w-12 rounded-full shadow-lg"
                                onClick={() => {
                                    setShowNote(!showNote);
                                    setShowHelp(false);
                                }}
                            >
                                <FileText className="h-5 w-5" />
                            </Button>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                        >
                            <Button
                                variant={showHelp ? "default" : "secondary"}
                                size="icon"
                                className="h-12 w-12 rounded-full shadow-lg"
                                onClick={() => {
                                    setShowHelp(!showHelp);
                                    setShowNote(false);
                                }}
                            >
                                <HelpCircle className="h-5 w-5" />
                            </Button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main FAB Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                    size="icon"
                    className={cn(
                        "h-14 w-14 rounded-full shadow-lg transition-all",
                        isExpanded && "rotate-45"
                    )}
                    onClick={() => {
                        setIsExpanded(!isExpanded);
                        if (isExpanded) {
                            setShowNote(false);
                            setShowHelp(false);
                        }
                    }}
                >
                    <motion.div
                        animate={{ rotate: isExpanded ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {isExpanded ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Sparkles className="h-6 w-6" />
                        )}
                    </motion.div>
                </Button>
            </motion.div>
        </div>
    );
}
