import { ReactNode } from "react";
import { cn } from "@/utils/utils";

interface MetricDisplayProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export const MetricDisplay = ({
  label,
  value,
  icon,
  className,
}: MetricDisplayProps) => {
  return (
    <div className={cn("tw:flex tw:flex-col tw:gap-1", className)}>
      <p className="margin-none tw:text-xs">{label}</p>
      <p className="margin-none tw:font-semibold tw:flex tw:gap-2 tw:items-center">
        {icon}
        {value}
      </p>
    </div>
  );
};
