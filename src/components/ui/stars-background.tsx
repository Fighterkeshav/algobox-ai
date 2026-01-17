"use client";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef } from "react";

interface StarProps {
    x: number;
    y: number;
    radius: number;
    opacity: number;
    twinkleSpeed: number | null;
}

interface StarsBackgroundProps {
    starDensity?: number;
    allStarsTwinkle?: boolean;
    twinkleProbability?: number;
    minTwinkleSpeed?: number;
    maxTwinkleSpeed?: number;
    className?: string;
}

export const StarsBackground = ({
    starDensity = 0.00015,
    allStarsTwinkle = true,
    twinkleProbability = 0.7,
    minTwinkleSpeed = 0.5,
    maxTwinkleSpeed = 1,
    className,
}: StarsBackgroundProps) => {
    const [stars, setStars] = useState<StarProps[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const updateStars = () => {
            if (canvasRef.current) {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                const { width, height } = canvas.getBoundingClientRect();
                canvas.width = width;
                canvas.height = height;

                const area = width * height;
                const numStars = Math.floor(area * starDensity);

                const newStars = Array.from({ length: numStars }, () => {
                    const shouldTwinkle = allStarsTwinkle || Math.random() < twinkleProbability;
                    return {
                        x: Math.random() * width,
                        y: Math.random() * height,
                        radius: Math.random() * 0.5 + 0.5,
                        opacity: Math.random() * 0.5 + 0.5,
                        twinkleSpeed: shouldTwinkle
                            ? minTwinkleSpeed + Math.random() * (maxTwinkleSpeed - minTwinkleSpeed)
                            : null,
                    };
                });
                setStars(newStars);
            }
        };

        updateStars();
        window.addEventListener("resize", updateStars);

        return () => {
            window.removeEventListener("resize", updateStars);
        };
    }, [
        starDensity,
        allStarsTwinkle,
        twinkleProbability,
        minTwinkleSpeed,
        maxTwinkleSpeed,
    ]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach((star) => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

                let currentOpacity = star.opacity;
                if (star.twinkleSpeed !== null) {
                    const time = Date.now() * 0.001 * star.twinkleSpeed;
                    // Oscillate opacity
                    currentOpacity = star.opacity * (0.5 + Math.sin(time) * 0.5);
                }

                ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [stars]);

    return (
        <canvas
            ref={canvasRef}
            className={cn("h-full w-full absolute inset-0 z-0", className)}
        />
    );
};
