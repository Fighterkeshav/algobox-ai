import React from "react";

export const GridBackground = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={`min-h-screen w-full bg-[#050505] relative text-white font-mono selection:bg-red-500/30 ${className}`}>
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage: `
            linear-gradient(to right, #1a1a1a 1px, transparent 1px),
            linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)
          `,
                    backgroundSize: '40px 40px',
                    maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
                }}
            />
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};
