import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
}

export function Spinner({ className, size = "md", ...props }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-4",
    lg: "w-12 h-12 border-[5px]",
    xl: "w-16 h-16 border-[6px]",
  };

  return (
    <div
      role="status"
      className={cn(
        "animate-spin rounded-full border-solid",
        "border-[#4E0707]/20 border-t-[#4E0707]",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function FullPageLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-1 items-center justify-center min-h-[calc(100vh-140px)] w-full",
        className,
      )}
    >
      <Spinner size="lg" />
    </div>
  );
}
