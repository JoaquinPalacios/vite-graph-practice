"use client";

import { Card, CardContent } from "@/components/ui/card";

import { UnitPreferences } from "@/types";

import GraphButtons from "./GraphButtons";
import { useState } from "react";
import SwellChart from "./SwellChart";
import TideChart from "./TideChart";
import WeatherChart from "./WeatherChart";

const SwellChartContainer = ({
  unitPreferences,
}: {
  unitPreferences: UnitPreferences;
}) => {
  // Add state to track scroll position and limits
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  // Add function to check scroll limits
  const checkScrollLimits = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.target as HTMLElement;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    setIsAtStart(scrollLeft === 0);
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 10); // -10 for some buffer
  };

  return (
    <Card className="w-full relative bg-slate-100 border-slate-700 max-w-[1340px] h-auto mx-auto px-4 py-0 rounded-lg">
      <GraphButtons isAtStart={isAtStart} isAtEnd={isAtEnd} />

      <CardContent
        className="p-0 w-full overflow-y-auto no-scrollbar chart-scroll-container [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-track]:bg-transparent [touch-action:none]"
        onScroll={(e) => {
          checkScrollLimits(e);
          const axes = document.querySelectorAll(
            ".recharts-yAxis"
          ) as NodeListOf<HTMLElement>;

          axes.forEach((axis) => {
            if (axis) {
              axis.style.transform = `translateX(${
                (e.target as HTMLElement).scrollLeft
              }px)`;
              axis.style.opacity = "0";
              setTimeout(() => {
                axis.style.opacity = "1";
              }, 400);

              if (!axis.querySelector(".y-axis-rect-left")) {
                // Create background rectangle
                const rect = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "rect"
                );

                // Set rectangle attributes
                rect.setAttribute("x", "0");
                rect.setAttribute("y", "0");
                rect.setAttribute("width", "64");
                rect.setAttribute("height", "544");
                rect.setAttribute("fill", "oklch(0.968 0.007 247.896)");
                rect.setAttribute("class", "y-axis-rect-left");

                // Insert rectangle as first child of the axis
                axis.insertBefore(rect, axis.firstChild);
              }
            }
          });
        }}
      >
        <SwellChart unitPreferences={unitPreferences} />
        <WeatherChart />
        <TideChart />
      </CardContent>
    </Card>
  );
};

export default SwellChartContainer;
