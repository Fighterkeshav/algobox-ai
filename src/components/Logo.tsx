import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        {/* Logo mark - stylized box/cube with code brackets */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          {/* Background glow */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(185 100% 50%)" />
              <stop offset="100%" stopColor="hsl(199 89% 48%)" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Outer box */}
          <rect
            x="2"
            y="2"
            width="28"
            height="28"
            rx="6"
            stroke="url(#logoGradient)"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
          />
          
          {/* Code brackets */}
          <path
            d="M12 10L8 16L12 22"
            stroke="url(#logoGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 10L24 16L20 22"
            stroke="url(#logoGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Center dot */}
          <circle cx="16" cy="16" r="2" fill="url(#logoGradient)" />
        </svg>
      </div>
      
      {showText && (
        <span className={cn(
          "font-bold tracking-tight text-gradient",
          textSizeClasses[size]
        )}>
          Algobox
        </span>
      )}
    </div>
  );
}
