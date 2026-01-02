"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

interface SliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  currentValue?: number;
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  currentValue,
  ...props
}: SliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
        ? defaultValue
        : [min, max],
    [value, defaultValue, min, max]
  );

  // Calculate change indicator if currentValue is provided
  const changeIndicator = React.useMemo(() => {
    if (currentValue === undefined) return null;

    const newValue = Array.isArray(value)
      ? value[0]
      : value ?? defaultValue?.[0] ?? min;
    if (newValue === currentValue) return null;

    const startPercent = (Math.min(currentValue, newValue) / max) * 100;
    const endPercent = (Math.max(currentValue, newValue) / max) * 100;
    const isIncrease = newValue > currentValue;

    return {
      startPercent,
      endPercent,
      isIncrease,
    };
  }, [currentValue, value, defaultValue, min, max]);

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={
          "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        }
        style={{ zIndex: 0 }}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={
            "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          }
          style={{ zIndex: 0 }}
        />
        {changeIndicator && (
          <div
            className={`absolute h-1.5 rounded-full pointer-events-none ${
              changeIndicator.isIncrease ? "bg-green-500" : "bg-red-500"
            }`}
            style={{
              left: `${changeIndicator.startPercent}%`,
              width: `${
                changeIndicator.endPercent - changeIndicator.startPercent
              }%`,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1,
              opacity: 0.5,
            }}
          />
        )}
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="border-primary ring-ring/50 block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 relative"
          style={{ zIndex: 2 }}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
