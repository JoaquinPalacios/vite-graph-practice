import { getEventStatus } from "@/lib/events";
import { EventData, EventTickRendererProps } from "@/types";
import React from "react";
import { EventStatusTick } from "./EventStatusTick";

interface EventTickRendererComponentProps extends EventTickRendererProps {
  eventData: EventData;
}

/**
 * Event tick renderer component that handles the rendering of event status ticks
 * @param props - The tick renderer props including position, payload, and event data
 * @returns JSX element for the event status tick
 */
export const EventTickRenderer: React.FC<EventTickRendererComponentProps> = ({
  x,
  y,
  payload,
  index,
  eventData,
}) => {
  // Safety check
  if (!payload || !payload.value) {
    console.warn("Missing payload for tick at index:", index);
    return <g />;
  }

  const eventStatus = getEventStatus(payload.value, eventData);

  return <EventStatusTick x={x} y={y} payload={{ value: eventStatus }} />;
};
