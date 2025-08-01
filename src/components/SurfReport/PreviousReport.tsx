import { getSurfHeightLabel } from "@/lib/surf";
import { formatTime } from "@/lib/time-utils";
import { SurfReportItem, UnitPreferences } from "@/types";
import { cn } from "@/utils/utils";
import { memo, useState } from "react";

interface PreviousReportItemProps {
  report: SurfReportItem;
  units: UnitPreferences["units"];
  timezone: string;
}

export const PreviousReportItem = memo(
  ({ report, units, timezone }: PreviousReportItemProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!report) return null;

    return (
      <div className="tw:mt-5">
        <p className="margin-bottom-2 tw:text-sm">
          Updated at: {formatTime(report.date, timezone)}
        </p>
        <p className="margin-bottom-2 tw:text-sm">
          Surf Condition: {report.surfQuality}
        </p>
        <p className="margin-bottom-2 tw:text-sm">
          Rating: {report.surfRating}/10
        </p>
        <p className="margin-bottom-2 tw:text-sm">Wind: {report.wind}</p>
        <p className="margin-bottom-2 tw:text-sm">
          Wave Height: {getSurfHeightLabel(report.surfHeight)}
          {units.surfHeight === "ft" ? "" : "m"}
        </p>
        <div>
          <p
            className={cn(
              "margin-none tw:text-sm tw:text-pretty",
              !isExpanded ? "tw:line-clamp-2" : ""
            )}
          >
            {report.report}
          </p>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="tw:text-xs tw:text-[#008993] tw:font-medium hover:tw:text-[#00b4c6]"
          >
            {isExpanded ? "Read less" : "Read more"}
          </button>
        </div>
      </div>
    );
  }
);

PreviousReportItem.displayName = "PreviousReportItem";
