"use client";

import {
  Label,
  Slider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
} from "react-aria-components";

import type { SliderProps } from "react-aria-components";

interface BrushSliderProps<T> extends SliderProps<T> {
  label?: string;
  thumbLabels?: string[];
}

function BrushSlider<T extends number | number[]>({
  label,
  thumbLabels,
  ...props
}: BrushSliderProps<T>) {
  return (
    <Slider
      {...props}
      className="relative flex h-[288px] w-4 touch-none select-none flex-col items-center rounded-full outline-1 outline-offset-1 outline-border"
    >
      <SliderTrack className=" relative w-2 grow rounded-full border border-border bg-secondary mx-auto">
        {({ state }) => (
          <>
            <div className="absolute w-full bottom-0  h-full rounded-full bg-muted bg-opacity-40" />
            <div
              className="absolute w-full bottom-0 rounded-full bg-primary"
              style={{ height: state.getThumbPercent(0) * 100 + "%" }}
            />
            <SliderThumb className="block h-6 w-6 rounded-full border-2 border-primary bg-background mx-1 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
          </>
        )}
      </SliderTrack>
    </Slider>
  );
}

export default BrushSlider;
