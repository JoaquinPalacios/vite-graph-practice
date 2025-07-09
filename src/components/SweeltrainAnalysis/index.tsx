"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { degreesToCompassDirection } from "@/lib/degrees-to-compass-direction";
import { getAdjustedDirection } from "@/lib/format-direction";
import { ChartDataItem, UnitPreferences } from "@/types";
import { getWindColor } from "@/utils/chart-utils";
import { cn } from "@/utils/utils";
import { formatInTimeZone } from "date-fns-tz";
import { useState } from "react";

interface SwellTrainAnalysisProps {
  chartData: ChartDataItem[];
  defaultPreferences: UnitPreferences;
  timezone: string;
  showAnalysis: boolean;
}

interface Session {
  time: string;
  surfBin: string;
  surfAvg: number;
  wind: {
    angle: number;
    direction: string;
    speed: number;
  };
  primary: {
    size: string;
    period: string;
    direction: string;
  };
  secondary: {
    size: string;
    period: string;
    direction: string;
  } | null;
  tertiary: {
    size: string;
    period: string;
    direction: string;
  } | null;
}

interface DayData {
  date: string;
  day: string;
  sessions: Session[];
}

// Transform chart data into the format needed for the component
const transformToTableData = (
  data: ChartDataItem[],
  timezone: string,
  unitPreferences: UnitPreferences
) => {
  // Helper function to safely parse string or number values
  const parseNumber = (value: string | number | null | undefined): number => {
    if (value === null || value === undefined) return 0;
    const num = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(num) ? 0 : num;
  };

  // Helper to get average from bin string (e.g. '3-5ft' or '1.0-1.5m')
  const getAverageFromBin = (bin: string): number => {
    if (!bin) return 0;
    const matches = bin.match(/(\d+(?:\.\d+)?)/g);
    if (!matches) return 0;
    const nums = matches.map(Number);
    if (nums.length === 1) return nums[0];
    if (nums.length === 2) return (nums[0] + nums[1]) / 2;
    return 0;
  };

  // Group data by day
  const groupedByDay = data.reduce((acc, item) => {
    const date = new Date(item.localDateTimeISO);
    const dayKey = formatInTimeZone(date, timezone, "d/MM");
    const dayName = formatInTimeZone(date, timezone, "EEEE");
    const timeKey = formatInTimeZone(date, timezone, "ha").toLowerCase();

    if (!acc[dayKey]) {
      acc[dayKey] = {
        date: dayKey,
        day: dayName,
        sessions: [],
      };
    }

    // Choose the correct bin string based on unitPreferences
    const surfBin =
      unitPreferences.units.surfHeight === "ft"
        ? item.primary?.fullSurfHeightFeetLabelBin || ""
        : item.primary?.fullSurfHeightMetresLabelBin || "";
    const surfAvg = getAverageFromBin(surfBin);

    // Get primary swell data with proper parsing
    const primaryTrain = item.trainData?.[0];
    const primaryDirection = parseNumber(primaryTrain?.direction);
    const primaryPeriod = parseNumber(primaryTrain?.peakPeriod);
    const primaryHeight = parseNumber(primaryTrain?.sigHeight);

    // Get secondary swell data with proper parsing
    const secondaryTrain = item.trainData?.[1];
    const secondaryDirection = parseNumber(secondaryTrain?.direction);
    const secondaryPeriod = parseNumber(secondaryTrain?.peakPeriod);
    const secondaryHeight = parseNumber(secondaryTrain?.sigHeight);

    // Get tertiary swell data with proper parsing
    const tertiaryTrain = item.trainData?.[2];
    const tertiaryDirection = parseNumber(tertiaryTrain?.direction);
    const tertiaryPeriod = parseNumber(tertiaryTrain?.peakPeriod);
    const tertiaryHeight = parseNumber(tertiaryTrain?.sigHeight);

    // Helper function to safely format numbers
    const formatNumber = (num: number): string => {
      return num.toFixed(1);
    };

    // Transform the data for each time slot
    const session: Session = {
      time: timeKey,
      surfBin,
      surfAvg,
      wind: {
        angle: parseNumber(item.wind.direction),
        direction: degreesToCompassDirection(parseNumber(item.wind.direction)),
        speed: Math.round(parseNumber(item.wind.speedKnots)),
      },
      primary: {
        size: `${formatNumber(primaryHeight)}m`,
        period: `${primaryPeriod}s`,
        direction: `${getAdjustedDirection(
          primaryDirection
        )} (${degreesToCompassDirection(primaryDirection)})`,
      },
      secondary: secondaryTrain
        ? {
            size: `${formatNumber(secondaryHeight)}m`,
            period: `${secondaryPeriod}s`,
            direction: `${getAdjustedDirection(
              secondaryDirection
            )} (${degreesToCompassDirection(secondaryDirection)})`,
          }
        : null,
      tertiary: tertiaryTrain
        ? {
            size: `${formatNumber(tertiaryHeight)}m`,
            period: `${tertiaryPeriod}s`,
            direction: `${getAdjustedDirection(
              tertiaryDirection
            )} (${degreesToCompassDirection(tertiaryDirection)})`,
          }
        : null,
    };

    acc[dayKey].sessions.push(session);
    return acc;
  }, {} as Record<string, DayData>);

  // Convert to array and sort by date
  return Object.values(groupedByDay).sort((a, b) => {
    const dateA = new Date(a.date.split("/").reverse().join("/"));
    const dateB = new Date(b.date.split("/").reverse().join("/"));
    return dateA.getTime() - dateB.getTime();
  });
};

const getSurfColor = (surfFeet: number) => {
  if (surfFeet < 1) return "tw:bg-blue-900 tw:text-white";
  if (surfFeet < 2) return "tw:bg-blue-800 tw:text-white";
  if (surfFeet < 3) return "tw:bg-blue-600 tw:text-white";
  if (surfFeet < 4) return "tw:bg-cyan-400 tw:text-white";
  if (surfFeet < 5) return "tw:bg-cyan-300 tw:text-black";
  if (surfFeet < 7) return "tw:bg-green-400 tw:text-black";
  if (surfFeet < 9) return "tw:bg-green-600 tw:text-black";
  if (surfFeet < 12) return "tw:bg-lime-400 tw:text-black";
  if (surfFeet < 15) return "tw:bg-yellow-400 tw:text-black";
  if (surfFeet < 18) return "tw:bg-amber-500 tw:text-black";
  if (surfFeet < 21) return "tw:bg-orange-500 tw:text-black";
  if (surfFeet < 24) return "tw:bg-orange-700 tw:text-white";
  if (surfFeet < 27) return "tw:bg-red-600 tw:text-white";
  if (surfFeet < 30) return "tw:bg-red-900 tw:text-white";
  if (surfFeet < 36) return "tw:bg-red-950 tw:text-white";
  if (surfFeet < 42) return "tw:bg-purple-800 tw:text-white";
  if (surfFeet < 48) return "tw:bg-fuchsia-500 tw:text-black";
  if (surfFeet < 54) return "tw:bg-pink-200 tw:text-black";
  if (surfFeet < 60) return "tw:bg-white tw:text-black";
  if (surfFeet < 66) return "tw:bg-gray-600 tw:text-white";
  return "tw:bg-black tw:text-white";
};

const getSwellColor = (size: string) => {
  const sizeNum = Number.parseFloat(size);
  if (sizeNum >= 3) return "tw:bg-emerald-100 tw:text-emerald-800";
  if (sizeNum >= 2) return "tw:bg-blue-100 tw:text-blue-800";
  if (sizeNum >= 1) return "tw:bg-cyan-100 tw:text-cyan-800";
  return "tw:bg-gray-100 tw:text-gray-800";
};

const getWindIcon = (direction: number, speed: number) => {
  const adjustedDirection = getAdjustedDirection(direction);
  const color = getWindColor(speed);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      height={16}
      width={16}
      fill={color || "currentColor"}
      className="tw:relative tw:-top-px tw:transition-colors tw:duration-200 tw:ease"
    >
      <path
        d="M17.66 11.39h-15l7.5-8.75 7.5 8.75z"
        transform={`rotate(${adjustedDirection}, 0, 0)`}
        style={{
          transformOrigin: "center",
        }}
        className="tw:transition-transform tw:duration-150 tw:ease"
      />
      <path
        d="M7.65 10h5v7.5h-5z"
        transform={`rotate(${adjustedDirection}, 0, 0)`}
        style={{
          transformOrigin: "center",
        }}
      />
    </svg>
  );
};

export default function SwellTrainAnalysis({
  chartData,
  defaultPreferences,
  timezone,
  showAnalysis,
}: SwellTrainAnalysisProps) {
  const surfData = transformToTableData(
    chartData,
    timezone,
    defaultPreferences
  );

  // Track which accordion items are open
  const [openItems, setOpenItems] = useState<string[]>(["day-0"]);

  return (
    <div
      className={cn(
        "tw:bg-background tw:transition-opacity",
        showAnalysis
          ? "tw:opacity-100"
          : "tw:opacity-0 tw:-z-10 tw:pointer-events-none tw:sr-only"
      )}
    >
      <div className="tw:container tw:mx-auto tw:max-w-full">
        {/* Forecast Accordion */}
        <Accordion
          type="multiple"
          className="tw:space-y-4"
          value={openItems}
          onValueChange={setOpenItems}
        >
          {surfData.map((day, index) => {
            const itemId = `day-${index}`;
            const isOpen = openItems.includes(itemId);

            return (
              <AccordionItem
                key={index}
                value={itemId}
                className="tw:odd:bg-gray-100 tw:even:bg-gray-200"
              >
                <AccordionTrigger className="tw:px-6 tw:py-4 tw:hover:no-underline tw:hover:bg-muted/50 tw:transition-colors">
                  <div className="tw:flex tw:flex-col tw:items-start tw:justify-between tw:w-full tw:gap-4">
                    <h3 className="margin-none">
                      {day.day} {day.date}
                    </h3>
                    {!isOpen && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="tw:w-16">Time</TableHead>
                            <TableHead className="tw:w-20">Surf</TableHead>
                            <TableHead className="tw:w-24">Wind</TableHead>
                            <TableHead className="tw:min-w-[200px]">
                              Primary Swell
                            </TableHead>
                            <TableHead className="tw:min-w-[180px]">
                              Secondary Swell
                            </TableHead>
                            <TableHead className="tw:min-w-[180px]">
                              Tertiary Swell
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="tw:hover:bg-muted/50 tw:transition-colors">
                            <TableCell className="font-normal tw:text-sm">
                              {day.sessions[4]?.time}
                            </TableCell>

                            <TableCell>
                              <span
                                className={cn(
                                  getSurfColor(day.sessions[4]?.surfAvg || 0),
                                  "font-normal tw:text-xs tw:px-2 tw:py-1 tw:rounded-xs"
                                )}
                              >
                                {day.sessions[4]?.surfBin}
                              </span>
                            </TableCell>

                            <TableCell>
                              <div className="font-normal tw:flex tw:items-center tw:gap-1">
                                {getWindIcon(
                                  day.sessions[4]?.wind.angle,
                                  day.sessions[4]?.wind.speed
                                )}
                                <span className="font-normal tw:text-xs tw:text-muted-foreground">
                                  {day.sessions[4]?.wind.speed}
                                  {defaultPreferences.units.wind === "knots"
                                    ? "kt"
                                    : "km/h"}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div
                                className={cn(
                                  "font-normal tw:inline-flex tw:items-center tw:gap-2 tw:px-2 tw:py-1 tw:rounded-xs tw:text-xs",
                                  getSwellColor(day.sessions[4]?.primary.size)
                                )}
                              >
                                <span className="font-normal tw:font-semibold">
                                  {day.sessions[4]?.primary.size}
                                </span>
                                <span className="font-normal tw:text-xs tw:opacity-75">
                                  {day.sessions[4]?.primary.period} •{" "}
                                  {day.sessions[4]?.primary.direction}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell>
                              {day.sessions[4]?.secondary ? (
                                <div className="font-normal tw:inline-flex tw:items-center tw:gap-2 tw:px-2 tw:py-1 tw:rounded-xs tw:text-xs tw:bg-blue-50/50 tw:text-blue-900">
                                  <span className="font-normal tw:font-semibold">
                                    {day.sessions[4]?.secondary.size}
                                  </span>
                                  <span className="font-normal tw:text-xs tw:opacity-75">
                                    {day.sessions[4]?.secondary.period} •{" "}
                                    {day.sessions[4]?.secondary.direction}
                                  </span>
                                </div>
                              ) : (
                                <span className="font-normal tw:text-xs tw:text-muted-foreground">
                                  —
                                </span>
                              )}
                            </TableCell>

                            <TableCell>
                              {day.sessions[4]?.tertiary ? (
                                <div className="font-normal tw:inline-flex tw:items-center tw:gap-2 tw:px-2 tw:py-1 tw:rounded-xs tw:text-xs tw:bg-purple-50 tw:text-purple-700">
                                  <span className="font-normal tw:font-semibold">
                                    {day.sessions[4]?.tertiary.size}
                                  </span>
                                  <span className="font-normal tw:text-xs tw:opacity-75">
                                    {day.sessions[4]?.tertiary.period} •{" "}
                                    {day.sessions[4]?.tertiary.direction}
                                  </span>
                                </div>
                              ) : (
                                <span className="font-normal tw:text-xs tw:text-muted-foreground">
                                  —
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </AccordionTrigger>

                <AccordionContent className="tw:px-6 tw:pb-6">
                  <div className="tw:overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="tw:w-16">Time</TableHead>
                          <TableHead className="tw:w-20">Surf</TableHead>
                          <TableHead className="tw:w-24">Wind</TableHead>
                          <TableHead className="tw:min-w-[200px]">
                            Primary Swell
                          </TableHead>
                          <TableHead className="tw:min-w-[180px]">
                            Secondary Swell
                          </TableHead>
                          <TableHead className="tw:min-w-[180px]">
                            Tertiary Swell
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {day.sessions.map((session, sessionIndex) => (
                          <TableRow
                            key={sessionIndex}
                            className="tw:hover:bg-muted/50 tw:transition-colors"
                          >
                            <TableCell className="tw:text-sm">
                              {session.time}
                            </TableCell>

                            <TableCell>
                              <span
                                className={cn(
                                  getSurfColor(session.surfAvg),
                                  "tw:text-xs tw:px-2 tw:py-1 tw:rounded-xs"
                                )}
                              >
                                {session.surfBin}
                              </span>
                            </TableCell>

                            <TableCell>
                              <div className="tw:flex tw:items-center tw:gap-1">
                                {getWindIcon(
                                  session.wind.angle,
                                  session.wind.speed
                                )}
                                <span className="tw:text-xs tw:text-muted-foreground">
                                  {session.wind.speed}
                                  {defaultPreferences.units.wind === "knots"
                                    ? "kt"
                                    : "km/h"}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div
                                className={cn(
                                  "tw:inline-flex tw:items-center tw:gap-2 tw:px-2 tw:py-1 tw:rounded-xs tw:text-xs",
                                  getSwellColor(session.primary.size)
                                )}
                              >
                                <span className="tw:font-semibold">
                                  {session.primary.size}
                                </span>
                                <span className="tw:text-xs tw:opacity-75">
                                  {session.primary.period} •{" "}
                                  {session.primary.direction}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell>
                              {session.secondary ? (
                                <div className="tw:inline-flex tw:items-center tw:gap-2 tw:px-2 tw:py-1 tw:rounded-xs tw:text-xs tw:bg-blue-50/50 tw:text-blue-900">
                                  <span className="tw:font-semibold">
                                    {session.secondary.size}
                                  </span>
                                  <span className="tw:text-xs tw:opacity-75">
                                    {session.secondary.period} •{" "}
                                    {session.secondary.direction}
                                  </span>
                                </div>
                              ) : (
                                <span className="tw:text-xs tw:text-muted-foreground">
                                  —
                                </span>
                              )}
                            </TableCell>

                            <TableCell>
                              {session.tertiary ? (
                                <div className="tw:inline-flex tw:items-center tw:gap-2 tw:px-2 tw:py-1 tw:rounded-xs tw:text-xs tw:bg-purple-50 tw:text-purple-700">
                                  <span className="tw:font-semibold">
                                    {session.tertiary.size}
                                  </span>
                                  <span className="tw:text-xs tw:opacity-75">
                                    {session.tertiary.period} •{" "}
                                    {session.tertiary.direction}
                                  </span>
                                </div>
                              ) : (
                                <span className="tw:text-xs tw:text-muted-foreground">
                                  —
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
