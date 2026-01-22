"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState, useRef } from "react";

interface ShootingStar {
    id: number;
    x: number;
    y: number;
    angle: number;
    scale: number;
    speed: number;
    distance: number;
}

interface ShootingStarsProps {
    minSpeed?: number;
    maxSpeed?: number;
    minDelay?: number;
    maxDelay?: number;
    starColor?: string;
    trailColor?: string;
    starWidth?: number;
    starHeight?: number;
    className?: string;
}

export const ShootingStars = ({
    minSpeed = 10,
    maxSpeed = 30,
    minDelay = 1200,
    maxDelay = 4200,
    starColor = "#9E00FF",
    trailColor = "#2EB9DF",
    starWidth = 10,
    starHeight = 1,
    className,
}: ShootingStarsProps) => {
    const [star, setStar] = useState<ShootingStar | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const createStar = () => {
            const { innerWidth, innerHeight } = window;
            const x = Math.random() * innerWidth;
            const y = 0;
            const angle = 45;
            const scale = 0.5 + Math.random();
            const speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
            const distance = Math.sqrt(Math.pow(innerWidth, 2) + Math.pow(innerHeight, 2));

            setStar({ id: Date.now(), x, y, angle, scale, speed, distance });

            const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
            setTimeout(createStar, randomDelay);
        };

        createStar();

        return () => { };
    }, [minSpeed, maxSpeed, minDelay, maxDelay]);

    useEffect(() => {
        if (!star) return;

        const moveStar = () => {
            if (svgRef.current) {
                const time = 0; // Animation driven by CSS/SVG for simpler improved performance in this specific impl or we can use requestAnimationFrame logic here if needed.
                // But here we're re-starting CSS animation by unmounting/remounting or just setting new keys.
            }
        };

        // For this simple implementation, the re-render with new key triggers the animation.
    }, [star]);

    return (
        <svg
            ref={svgRef}
            className={cn("w-full h-full absolute inset-0 z-0", className)}
        >
            {star && (
                <rect
                    key={star.id}
                    x={star.x}
                    y={star.y}
                    width={starWidth * star.scale}
                    height={starHeight}
                    fill="url(#gradient)"
                    transform={`rotate(${star.angle}, ${star.x + (starWidth * star.scale) / 2}, ${star.y + starHeight / 2})`}
                >
                    <animateMotion
                        path={`M 0 0 L -${star.distance} ${star.distance}`}
                        dur={`${star.distance / star.speed}s`}
                        begin="0s"
                        fill="freeze"
                        onEnded={() => setStar(null)}
                    />
                </rect>
            )}
            <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: trailColor, stopOpacity: 0 }} />
                    <stop offset="100%" style={{ stopColor: starColor, stopOpacity: 1 }} />
                </linearGradient>
            </defs>
        </svg>
    );
};
