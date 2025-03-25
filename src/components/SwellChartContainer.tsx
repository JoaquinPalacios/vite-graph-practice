"use client";

import { Card, CardContent } from "@/components/ui/card";

import { UnitPreferences } from "./UnitSelector";

import GraphButtons from "./GraphButtons";
import { useState } from "react";
import SwellChart from "./SwellChart";
import TideChart from "./TideChart";

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
    <Card className="w-full relative bg-slate-200 border-slate-700 max-w-[1340px] h-auto mx-auto px-4">
      <GraphButtons isAtStart={isAtStart} isAtEnd={isAtEnd} />

      <CardContent
        className="p-0 w-full overflow-y-auto no-scrollbar chart-scroll-container [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-track]:bg-transparent [touch-action:none]"
        onScroll={(e) => {
          checkScrollLimits(e);
          const axis = document.querySelector(".recharts-yAxis") as HTMLElement;
          if (axis) {
            axis.style.transform = `translateX(${
              (e.target as HTMLElement).scrollLeft
            }px)`;
            axis.style.opacity = "0";
            setTimeout(() => {
              axis.style.opacity = "1";
            }, 400);
          }

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
            rect.setAttribute("height", "480");
            rect.setAttribute("fill", "rgb(226 232 240)"); // Using slate-200 color to match card background
            rect.setAttribute("class", "y-axis-rect-left");

            // Insert rectangle as first child of the axis
            axis.insertBefore(rect, axis.firstChild);
          }
        }}
      >
        <SwellChart unitPreferences={unitPreferences} />
        <TideChart />
      </CardContent>
    </Card>
  );
};

export default SwellChartContainer;
