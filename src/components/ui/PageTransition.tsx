import { useRef, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

interface PageTransitionProps {
    children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    useLayoutEffect(() => {
        // Only animate if ref exists
        if (!containerRef.current) return;

        // Set initial state (invisible and slightly down)
        const ctx = gsap.context(() => {
            gsap.fromTo(containerRef.current,
                { opacity: 0, y: 15, scale: 0.98 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.out",
                    clearProps: "all" // Clear styles after animation to prevent conflicts
                }
            );
        }, containerRef);

        return () => ctx.revert(); // Cleanup GSAP context
    }, [location.pathname]); // Re-run on route change

    return (
        <div ref={containerRef} className="w-full h-full">
            {children}
        </div>
    );
}
