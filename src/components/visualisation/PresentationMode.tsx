import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    MonitorPlay,
    X,
    ChevronLeft,
    ChevronRight,
    Play,
    Pause,
    SkipBack,
    RotateCcw
} from "lucide-react";
import { type AlgorithmId } from "@/lib/algorithms/algorithmCode";
import { ALGORITHM_DETAILS } from "@/lib/algorithms/algorithmDetails";
import ReactMarkdown from "react-markdown";

interface PresentationModeProps {
    algorithm: AlgorithmId;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    // Playback controls
    isPlaying: boolean;
    onPlay: () => void;
    onStepForward: () => void;
    onStepBack: () => void;
    onReset: () => void;
}

export function PresentationMode({
    algorithm,
    isOpen,
    onClose,
    children,
    isPlaying,
    onPlay,
    onStepForward,
    onStepBack,
    onReset
}: PresentationModeProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const details = ALGORITHM_DETAILS[algorithm];
    const slides = details?.slides || [];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === "ArrowRight") nextSlide();
            if (e.key === "ArrowLeft") prevSlide();
            if (e.key === "Escape") onClose();
            if (e.key === " ") {
                e.preventDefault();
                onPlay();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, currentSlide, onPlay]);

    if (!isOpen || !details) return null;

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) setCurrentSlide(curr => curr + 1);
    };

    const prevSlide = () => {
        if (currentSlide > 0) setCurrentSlide(curr => curr - 1);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border/50 bg-background/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                            <MonitorPlay className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">{details.name}</h1>
                            <p className="text-sm text-muted-foreground">Presentation Mode</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm font-mono text-muted-foreground">
                            Slide {currentSlide + 1} / {slides.length}
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">

                    {/* Main Visualization Area */}
                    <div className="lg:col-span-2 p-6 flex flex-col items-center justify-center bg-black/20 relative">
                        {/* This is where we inject the visualization */}
                        <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white/10 relative group">
                            {children}

                            {/* Playback Control Bar - Appears on Hover or Static */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/80 backdrop-blur border border-white/10 p-2 rounded-full shadow-xl transition-opacity opacity-0 group-hover:opacity-100">
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 text-white" onClick={onReset}>
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 text-white" onClick={onStepBack}>
                                    <SkipBack className="h-4 w-4" />
                                </Button>
                                <Button size="icon" className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={onPlay}>
                                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 text-white" onClick={onStepForward}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Overlay Controls Hint */}
                            <div className="absolute top-4 right-4 bg-black/50 px-3 py-1.5 rounded-full text-[10px] text-white/50 pointer-events-none border border-white/5">
                                Space to Play/Pause
                            </div>
                        </div>
                    </div>

                    {/* Slide Content */}
                    <div className="lg:col-span-1 p-8 flex flex-col justify-center bg-card/30 border-l border-border/50">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-bold text-primary">
                                {slides[currentSlide].title}
                            </h2>
                            <div className="prose prose-invert prose-lg text-muted-foreground">
                                <ReactMarkdown>{slides[currentSlide].content}</ReactMarkdown>
                            </div>
                        </motion.div>

                        {/* Navigation Controls */}
                        <div className="mt-12 flex items-center justify-between">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={prevSlide}
                                disabled={currentSlide === 0}
                                className="w-32"
                            >
                                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                            </Button>

                            <div className="flex gap-2">
                                {slides.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-2 w-2 rounded-full transition-colors ${idx === currentSlide ? "bg-primary" : "bg-primary/20"
                                            }`}
                                    />
                                ))}
                            </div>

                            <Button
                                variant="default"
                                size="lg"
                                onClick={nextSlide}
                                disabled={currentSlide === slides.length - 1}
                                className="w-32"
                            >
                                Next <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                </div>
            </motion.div>
        </AnimatePresence>
    );
}
