import { degreesToCompassDirection, getAdjustedDirection } from "@/lib/surf";
import { ChartDataItem, UnitPreferences } from "@/types";
import { cn } from "@/utils/utils";
import { MetricCard } from "./MetricCard";
import { MetricDisplay } from "./MetricDisplay";

interface SwellMetricsProps {
  chartData: ChartDataItem;
  defaultPreferences: UnitPreferences;
  type: "primary" | "secondary";
  className?: string;
}

export const SwellMetrics = ({
  chartData,
  defaultPreferences,
  type,
  className,
}: SwellMetricsProps) => {
  const swellData =
    type === "primary" ? chartData.primary : chartData.secondary;
  const showFullWidth = !chartData.secondary;

  if (!swellData) return null;

  return (
    <div className={cn("tw:space-y-2", className)}>
      <p className="margin-bottom-2 tw:text-sm tw:font-medium">
        {type === "primary" ? "Primary" : "Secondary"} Swell
      </p>
      <div
        className={cn(
          "tw:grid tw:grid-cols-2 tw:gap-2",
          showFullWidth && "tw:sm:grid-cols-4"
        )}
      >
        <MetricCard>
          <MetricDisplay
            label="Height"
            value={
              defaultPreferences.units.surfHeight === "ft"
                ? swellData.fullSurfHeightFeetLabelBin
                : swellData.fullSurfHeightMetresLabelBin
            }
          />
        </MetricCard>

        <MetricCard>
          <MetricDisplay
            label="Period"
            value={`${chartData.trainData?.[0]?.peakPeriod ?? "N/A"}s`}
          />
        </MetricCard>

        {swellData.direction && (
          <>
            <MetricCard>
              <MetricDisplay
                label="Direction"
                value={degreesToCompassDirection(
                  getAdjustedDirection(chartData.trainData?.[0]?.direction ?? 0)
                )}
              />
            </MetricCard>
            <MetricCard>
              <MetricDisplay
                label="Angle"
                value={`${getAdjustedDirection(
                  chartData.trainData?.[0]?.direction ?? 0
                )}°`}
              />
            </MetricCard>
          </>
        )}
      </div>
    </div>
  );
};
