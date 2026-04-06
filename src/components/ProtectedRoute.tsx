import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex h-screen w-full bg-[#020617]">
                {/* Sidebar skeleton */}
                <div className="w-[60px] h-full bg-[#0a0f1e] border-r border-slate-800/50 flex-shrink-0 flex flex-col gap-4 items-center pt-6">
                    <div className="h-8 w-8 rounded-lg bg-slate-800 animate-pulse" />
                    {[...Array(6)].map((_, i) => <div key={i} className="h-8 w-8 rounded-lg bg-slate-800/60 animate-pulse" />)}
                </div>
                {/* Main content skeleton */}
                <div className="flex-1 p-8 flex flex-col gap-6 overflow-hidden">
                    <div className="h-9 w-48 rounded-xl bg-slate-800 animate-pulse" />
                    <div className="grid grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-slate-800/70 animate-pulse" />)}
                    </div>
                    <div className="grid grid-cols-3 gap-6 flex-1">
                        <div className="col-span-2 rounded-2xl bg-slate-800/50 animate-pulse" />
                        <div className="rounded-2xl bg-slate-800/50 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
