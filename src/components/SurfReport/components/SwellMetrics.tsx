import { ChartDataItem, UnitPreferences } from "@/types";
import { MetricCard } from "./MetricCard";
import { MetricDisplay } from "./MetricDisplay";
import { degreesToCompassDirection } from "@/lib/degrees-to-compass-direction";
import { getAdjustedDirection } from "@/lib/format-direction";
import { cn } from "@/utils/utils";

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
          showFullWidth && "tw:lg:grid-cols-4"
        )}
      >
        <MetricCard>
          <MetricDisplay
            label="Height"
            value={`${
              defaultPreferences.units.surfHeight === "ft"
                ? Math.round(swellData.fullSurfHeightFeet ?? 0)
                : Math.round(swellData.fullSurfHeightMetres ?? 0)
            }${defaultPreferences.units.surfHeight === "ft" ? "ft" : "m"}`}
          />
        </MetricCard>

        <MetricCard>
          <MetricDisplay
            label="Period"
            value={chartData.trainData?.map((train) =>
              Math.round(train.peakPeriod ?? 0)
            )}
          />
        </MetricCard>

        {swellData.direction && (
          <>
            <MetricCard>
              <MetricDisplay
                label="Direction"
                value={degreesToCompassDirection(
                  getAdjustedDirection(swellData.direction)
                )}
              />
            </MetricCard>
            <MetricCard>
              <MetricDisplay
                label="Angle"
                value={`${getAdjustedDirection(swellData.direction)}°`}
              />
            </MetricCard>
          </>
        )}
      </div>
    </div>
  );
};
