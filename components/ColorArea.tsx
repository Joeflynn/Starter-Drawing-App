"use client";

import React, { CSSProperties, useRef } from "react";
import { ColorAreaAria, useColorArea } from "@react-aria/color";
import { FocusRingProps, useFocusRing } from "@react-aria/focus";
import { ColorAreaState, useColorAreaState } from "@react-stately/color";
import { ColorChannel } from "@react-types/color";
import { Color } from "@react-types/color";

const SIZE = 134;
const FOCUSED_THUMB_SIZE = 28;
const THUMB_SIZE = 20;
const BORDER_RADIUS = 5;

interface ColorAreaProps extends React.PropsWithChildren<{}> {
  "aria-labelledby": string;
  isDisabled: boolean;
  value: Color;
  onChange: (color: Color) => void;
  xChannel: ColorChannel;
  yChannel: ColorChannel;
}

const ColorArea: React.FC<ColorAreaProps> = (props) => {
  const inputXRef = useRef<HTMLInputElement>(null);
  const inputYRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const state: ColorAreaState = useColorAreaState(props);

  const { isDisabled } = props;

  const {
    colorAreaProps,
    gradientProps,
    xInputProps,
    yInputProps,
    thumbProps,
  }: ColorAreaAria = useColorArea(
    { ...props, inputXRef, inputYRef, containerRef },
    state
  );

  const { isFocusVisible, ...focusProps } = useFocusRing();

  const containerStyle: CSSProperties = {
    ...colorAreaProps.style,
    width: SIZE,
    height: SIZE,

    borderRadius: BORDER_RADIUS,
    opacity: isDisabled ? 0.3 : 1,
  };

  const gradientStyle: CSSProperties = {
    backgroundColor: isDisabled ? "rgb(142, 142, 142)" : "rgb(255, 255, 255)",
    ...gradientProps.style,

    borderRadius: BORDER_RADIUS,
    border: `0.5px border-border ${
      isDisabled ? "rgb(142, 142, 142)" : "rgba(142, 142, 142, 0.9)"
    }`,
    height: SIZE,
    width: SIZE,
  };

  const thumbStyle: CSSProperties = {
    ...thumbProps.style,
    background: isDisabled
      ? "rgb(142, 142, 142)"
      : state.getDisplayColor().toString("css"),
    border: `2px solid ${isDisabled ? "rgb(142, 142, 142)" : "white"}`,
    borderRadius: "50%",
    boxShadow: "0 0 0 1px black, inset 0 0 0 1px black",
    boxSizing: "border-box",
    height: isFocusVisible ? FOCUSED_THUMB_SIZE + 4 : THUMB_SIZE,
    transform: "translate(-50%, -50%)",
    width: isFocusVisible ? FOCUSED_THUMB_SIZE + 4 : THUMB_SIZE,
  };

  return (
    <div ref={containerRef} {...colorAreaProps} style={containerStyle}>
      <div {...gradientProps} style={gradientStyle} />
      <div {...thumbProps} style={thumbStyle}>
        <input ref={inputXRef} {...xInputProps} {...focusProps} />
        <input ref={inputYRef} {...yInputProps} {...focusProps} />
      </div>
    </div>
  );
};
export default ColorArea;
