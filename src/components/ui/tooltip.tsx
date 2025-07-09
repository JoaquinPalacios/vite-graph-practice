import { cn } from "@/utils/utils";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  children,
  useTouch = false,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root> & {
  useTouch?: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  const handleTouch = (event: React.TouchEvent | React.MouseEvent) => {
    event.persist();
    setOpen(true);
  };
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root
        data-slot="tooltip"
        open={open}
        onOpenChange={setOpen}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && useTouch) {
            return React.cloneElement(
              child as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
              {
                onTouchStart: handleTouch,
                onMouseDown: handleTouch,
              }
            );
          }
          return child;
        })}
      </TooltipPrimitive.Root>
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "tw:bg-gray-900 tw:w-fit tw:text-white tw:animate-in tw:fade-in-0 tw:zoom-in-95 tw:data-[state=closed]:animate-out tw:data-[state=closed]:fade-out-0 tw:data-[state=closed]:zoom-out-95 tw:data-[side=bottom]:slide-in-from-top-2 tw:data-[side=left]:slide-in-from-right-2 tw:data-[side=right]:slide-in-from-left-2 tw:data-[side=top]:slide-in-from-bottom-2 tw:z-50 tw:origin-(--radix-tooltip-content-transform-origin) tw:rounded-sm tw:px-3 tw:py-1.5",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="tw:z-50 tw:size-2 tw:fill-gray-900" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
