"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animate, stagger } from "animejs";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// --- GSAP SECTION ---

// Animation presets
export const animations = {
    fadeInUp: {
        from: { opacity: 0, y: 50 },
        to: { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
    },
    fadeInDown: {
        from: { opacity: 0, y: -50 },
        to: { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
    },
    fadeInLeft: {
        from: { opacity: 0, x: -50 },
        to: { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
    },
    fadeInRight: {
        from: { opacity: 0, x: 50 },
        to: { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
    },
    scaleIn: {
        from: { opacity: 0, scale: 0.8 },
        to: { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
    },
    slideUp: {
        from: { y: 100, opacity: 0 },
        to: { y: 0, opacity: 1, duration: 1, ease: "power4.out" },
    },
    rotateIn: {
        from: { opacity: 0, rotationY: 90 },
        to: { opacity: 1, rotationY: 0, duration: 0.8, ease: "power2.out" },
    },
    // "Hell" mode animations (more intense)
    explodeIn: {
        from: { opacity: 0, scale: 0, rotation: -45 },
        to: { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" }
    }
};

// Hook for scroll-triggered animations
export function useScrollAnimation(
    options: {
        animation?: keyof typeof animations;
        stagger?: number;
        delay?: number;
        trigger?: string;
        start?: string;
        end?: string;
        scrub?: boolean | number;
    } = {}
) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const {
            animation = "fadeInUp",
            stagger = 0,
            delay = 0,
            trigger,
            start = "top 85%", // Slightly earlier start
            end = "bottom 20%",
            scrub = false,
        } = options;

        const anim = animations[animation];
        const elements = stagger > 0 ? ref.current.children : ref.current;

        const ctx = gsap.context(() => {
            gsap.fromTo(elements, anim.from, {
                ...anim.to,
                delay,
                stagger: stagger > 0 ? stagger : undefined,
                scrollTrigger: {
                    trigger: trigger || ref.current,
                    start,
                    end,
                    scrub,
                    toggleActions: "play none none reverse",
                    // markers: true, // Uncomment for debugging
                },
            });
        }, ref);

        return () => ctx.revert();
    }, [options]);

    return ref;
}

// Hook for staggered list animations
export function useStaggerAnimation(staggerDelay = 0.1, animation: keyof typeof animations = "fadeInUp") {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const anim = animations[animation];
        const children = ref.current.children;

        const ctx = gsap.context(() => {
            gsap.fromTo(children, anim.from, {
                ...anim.to,
                stagger: staggerDelay,
                scrollTrigger: {
                    trigger: ref.current,
                    start: "top 90%",
                    toggleActions: "play none none reverse",
                },
            });
        }, ref);

        return () => ctx.revert();
    }, [staggerDelay, animation]);

    return ref;
}

// Hook for intense hover animations
export function useHoverAnimation(intensity = 1) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const element = ref.current;

        const handleMouseEnter = () => {
            gsap.to(element, {
                scale: 1 + (0.05 * intensity),
                y: -5 * intensity,
                textShadow: `0 0 ${10 * intensity}px rgba(6, 182, 212, 0.5)`, // Cyan glow
                duration: 0.3,
                ease: "power2.out",
                overwrite: true
            });
        };

        const handleMouseLeave = () => {
            gsap.to(element, {
                scale: 1,
                y: 0,
                textShadow: "none",
                duration: 0.3,
                ease: "power2.out",
                overwrite: true
            });
        };

        element.addEventListener("mouseenter", handleMouseEnter);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            element.removeEventListener("mouseenter", handleMouseEnter);
            element.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [intensity]);

    return ref;
}

// Hook for text reveal animation
export function useTextReveal() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const ctx = gsap.context(() => {
            // Split text into words (simple approach)
            const text = ref.current!.innerText;
            const words = text.split(" ");
            ref.current!.innerHTML = words
                .map((word) => `<span class="inline-block overflow-hidden"><span class="inline-block translate-y-full opacity-0 will-change-transform">${word}</span></span>`)
                .join(" ");

            const innerSpans = ref.current!.querySelectorAll("span > span");

            gsap.fromTo(
                innerSpans,
                { y: "100%", opacity: 0 },
                {
                    y: "0%",
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.05,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: ref.current,
                        start: "top 90%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        }, ref);

        return () => ctx.revert();
    }, []);

    return ref;
}

// Magnetic button effect
export function useMagneticEffect(strength = 0.5) { // Increased default strength
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(element, {
                x: x * strength,
                y: y * strength,
                rotation: x * 0.05, // Slight rotation for more feel
                duration: 0.3,
                ease: "power2.out",
            });
        };

        const handleMouseLeave = () => {
            gsap.to(element, {
                x: 0,
                y: 0,
                rotation: 0,
                duration: 0.8,
                ease: "elastic.out(1.2, 0.4)", // Bouncier return
            });
        };

        element.addEventListener("mousemove", handleMouseMove);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            element.removeEventListener("mousemove", handleMouseMove);
            element.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [strength]);

    return ref;
}

// Parallax effect hook
export function useParallax(speed = 0.5) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const ctx = gsap.context(() => {
            gsap.to(ref.current, {
                y: () => window.innerHeight * speed,
                ease: "none",
                scrollTrigger: {
                    trigger: ref.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
            });
        }, ref);

        return () => ctx.revert();
    }, [speed]);

    return ref;
}

// Counter animation hook
export function useCountUp(endValue: number, duration = 2) {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const ctx = gsap.context(() => {
            // Ensure starting from 0 explicitly
            ref.current!.innerText = "0";

            gsap.to(
                ref.current,
                {
                    innerText: endValue,
                    duration,
                    ease: "power2.out",
                    snap: { innerText: 1 },
                    scrollTrigger: {
                        trigger: ref.current,
                        start: "top 85%",
                        toggleActions: "restart none none none",
                    },
                }
            );
        }, ref);

        return () => ctx.revert();
    }, [endValue, duration]);

    return ref;
}


// --- ANIME.JS SECTION ---

// Hook for Anime.js timeline animations
export function useAnimeTimeline(options: any = {}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        // Example: Entrance with slight elasticity
        animate(ref.current.children, {
            translateY: [20, 0],
            opacity: [0, 1],
            delay: stagger(100, { start: 200 }),
            duration: 800,
            easing: 'easeOutElastic(1, .8)'
        });

    }, []);

    return ref;
}

// Hook for specific "glitch" or intense effect using Anime.js
export function useGlitchEffect() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;

        const anim = animate(element, {
            skewX: [
                { value: 10, duration: 100, easing: 'easeInOutSine' },
                { value: -10, duration: 100, easing: 'easeInOutSine' },
                { value: 0, duration: 100, easing: 'easeInOutSine' }
            ],
            scale: [
                { value: 1.05, duration: 100, easing: 'easeInOutSine' },
                { value: 1, duration: 100, easing: 'easeInOutSine' }
            ],
            filter: [
                { value: 'hue-rotate(90deg)', duration: 100 },
                { value: 'hue-rotate(0deg)', duration: 100 }
            ],
            loop: false,
            autoplay: false
        });

        const trigger = () => {
            if (!anim.began || anim.completed) {
                anim.restart();
            }
        };

        element.addEventListener('mouseenter', trigger);
        element.addEventListener('click', trigger);

        return () => {
            element.removeEventListener('mouseenter', trigger);
            element.removeEventListener('click', trigger);
        };
    }, []);

    return ref;
}
