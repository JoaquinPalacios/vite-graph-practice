import { ReactNode } from "react";
import { cn } from "@/utils/utils";

interface MetricCardProps {
  children: ReactNode;
  className?: string;
}

export const MetricCard = ({ children, className }: MetricCardProps) => {
  return (
    <div className={cn("tw:bg-slate-100 tw:p-1.5 tw:h-fit", className)}>
      {children}
    </div>
  );
};
