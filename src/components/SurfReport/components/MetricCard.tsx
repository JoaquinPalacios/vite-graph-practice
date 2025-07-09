import { cn } from "@/utils/utils";
import { ReactNode } from "react";

interface MetricCardProps {
  children: ReactNode;
  className?: string;
}

export const MetricCard = ({ children, className }: MetricCardProps) => {
  return (
    <div className={cn("tw:bg-gray-100 tw:p-1.5 tw:h-fit", className)}>
      {children}
    </div>
  );
};
