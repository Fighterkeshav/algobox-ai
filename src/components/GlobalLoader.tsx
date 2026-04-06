import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Loader from "@/components/ui/Loader";

export function GlobalLoader() {
    const location = useLocation();
    const [loading, setLoading] = useState(false); // No initial load block to fix LCP/FCP metrics

    // Removed initial mount delay completely to allow instant FCP

    useEffect(() => {
        // Show a brief loader only on route changes to avoid blocking content
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 200); // Drastically reduced for UX
        return () => clearTimeout(timer);
    }, [location.pathname]);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
            <Loader />
        </div>
    );
}
