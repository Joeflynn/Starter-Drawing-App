"use client";

import React from "react";

import { useMemo, useState } from "react";
import { useSliderState } from "@react-stately/slider";
import { useSlider, useSliderThumb } from "@react-aria/slider";

import {
  Slider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
} from "react-aria-components";

import type { SliderProps } from "react-aria-components";

import { Label } from "@/components/ui/label";

interface CompactSliderProps<T> extends SliderProps<T> {
  label?: string;
  thumbLabels?: string[];
}

function CompactSlider<T extends number | number[]>({
  label,
  thumbLabels,
  ...props
}: CompactSliderProps<T>) {
  return (
    <Slider {...props} className="w-full">
      {/* <div className="w-full flex flex-row gap-2"> */}
      {/* <div className="flex py-1 px-0 justify-center items-center sm:text-sm">
          <Label className="flex-1">{label}</Label>
          <SliderOutput />
        </div> */}
      <SliderTrack className="relative w-full h-7 ">
        {({ state }) => (
          <>
            <div className="absolute h-2 top-[50%] transform translate-y-[-50%] w-full rounded-full bg-primary-foreground border border-border" />
            <div
              className="absolute h-2 top-[50%] transform translate-y-[-50%] rounded-full bg-secondary-foreground"
              style={{ width: state.getThumbPercent(0) * 100 + "%" }}
            />
            <SliderThumb className="h-5 w-5 top-[50%] rounded-full border-2 border-secondary-foreground  bg-accent transition-colors data-[dragging]:bg-purple-100 outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-black" />
          </>
        )}
      </SliderTrack>
      {/* </div> */}
    </Slider>
  );
}

export default CompactSlider;
