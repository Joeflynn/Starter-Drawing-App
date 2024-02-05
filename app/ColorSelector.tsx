"use client";

import ColorArea from "@/components/ColorArea";
import ColorField from "@/components/ColorField";
import ColorSwatch from "@/components/ColorSwatch";
import { ColorWheel } from "@/components/ColorWheel";
import { Eyedropper24Filled } from "@fluentui/react-icons";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Card } from "@/components/ui/card";
import React, { useEffect, useState, useRef } from "react";
import { Color, parseColor, useColorSliderState } from "@react-stately/color";
import { ColorChannel } from "@react-types/color";
import colorData from "../Assets/colorpalettes.json";

interface ColorSelectorProps {
  color: Color;
  setColor: (color: string) => void;
  pickColor: () => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  color,
  setColor,
  pickColor,
}) => {
  let [colorBG, setColorBG] = React.useState(
    parseColor("hsba(0, 0%, 100%, 1)")
  );
  let [endColor, setEndColor] = React.useState(color);
  let [hChannel, sChannel, bChannel] = color.getColorChannels();
  const [showColorSelector, setShowColorSelector] = useState(false);

  return (
    <>
      <Toggle
        className="p-0"
        onClick={() => setShowColorSelector(!showColorSelector)}
      >
        <div className="my-auto flex h-11 w-11 items-center justify-center p-2">
          <div
            className={`flex h-8 w-8 flex-row items-center justify-center rounded-full border border-[#5683DE] p-0 ${showColorSelector ? "border-2" : ""}`}
          >
            <div
              className="h-7 w-7 rounded-full border border-border "
              style={{
                backgroundColor: color.toString("css"),
              }}
            ></div>
          </div>
        </div>
      </Toggle>
      {showColorSelector && (
        <div className="absolute top-0 right-0 pt-2 pr-16 pointer-events-none">
          <Card className="p-2 w-[280px] pointer-events-auto	">
            <div className=" flex h-fit w-fit  flex-col items-center justify-center rounded-lg p-1">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Color</h4>
                  <p className="text-sm text-muted-foreground hidden">
                    Set primary color.
                  </p>
                </div>
                <div className="grid gap-4 mx-auto">
                  <div className="h-[0px]  w-[248px] inset-0 z-10">
                    <div className="relative h-[248px] w-[248px] p-0">
                      <ColorWheel
                        className=" inset-0 p-0"
                        value={color}
                        onChange={setColor}
                      />
                    </div>
                  </div>
                  <div className="inset-0 mx-auto mt-[-16px] flex h-[248px] w-[248px] content-center justify-center p-[57px] align-middle">
                    <div className="inset-0 z-20 h-[134px] w-[134px] p-[0px]">
                      <ColorArea
                        aria-labelledby="hsb-label-id-1"
                        value={color}
                        onChange={setColor}
                        onChangeEnd={setEndColor}
                        isDisabled={false}
                        xChannel={sChannel}
                        yChannel={bChannel}
                      />
                    </div>
                  </div>
                  <div className="my-auto flex w-full content-center items-center justify-between gap-4 px-0 py-2">
                    <ColorField
                      className="my-auto"
                      value={color}
                      onChange={setColor}
                    />
                    <div className="my-auto flex w-fit content-center items-center justify-between gap-2 py-2">
                      <ColorSwatch
                        value={color.withChannelValue("alpha", 1)}
                        aria-label={`current color swatch: ${color.toString(
                          "hsl"
                        )}`}
                      />
                      <Button
                        onClick={pickColor}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Eyedropper24Filled className="h5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="mx-auto grid w-full grid-cols-7 gap-1 py-2">
                    {colorData.colors.map((color, index) => {
                      const [h, s, b] = color.hsb.split(", ");
                      return (
                        <Button
                          key={index}
                          className="h-8 w-8 border border-border "
                          style={{ backgroundColor: color.hex }}
                          onClick={() =>
                            setColor(parseColor(`hsb(${h}, ${s}%, ${b}%)`))
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
