"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Toggle } from "@/components/ui/toggle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Options20Regular,
  Orientation24Regular,
  Link24Regular,
} from "@fluentui/react-icons";

import ColorField from "@/components/ColorField";
import ColorSwatch from "@/components/ColorSwatch";
import { ColorWheel } from "@/components/ColorWheel";
import ColorArea from "@/components/ColorArea";
import { ColorSlider } from "@/components/ColorSlider";
import React, { useEffect, useState, useRef } from "react";
import { Color, parseColor, useColorSliderState } from "@react-stately/color";
import { Checkbox } from "@/components/ui/checkbox";

interface CanvasSettingsProps {
  //colorBG: Color;
  //setColorBG: (value: string) => Color;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  setPreset: (preset: string) => void;
  setLinked: (linked: boolean) => void;
  width: number;
  height: number;
  preset: string;
  linked: boolean;
}

export const CanvasSettings: React.FC<CanvasSettingsProps> = ({
  // colorBG,
  //setColorBG,
  width,
  setWidth,
  setHeight,
  setLinked,
  setPreset,
  height,
  preset,
  linked,
}) => {
  //  let [hChannel, sChannel, bChannel] = colorBG.getColorChannels();

  useEffect(() => {
    setWidth(width);
    setHeight(height);
  }, [setHeight, width, setWidth, height]);

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (linked) {
      setHeight((newWidth / width) * height);
    }
    setPreset("Custom");
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (linked) {
      setWidth((newHeight / height) * width);
    }
    setPreset("Custom");
  };

  const handlePresetChange = (newPreset: string) => {
    const dimensions = newPreset.split(" x ");
    setWidth(parseInt(dimensions[0]));
    setHeight(parseInt(dimensions[1]));
    setPreset(newPreset);
  };

  const handleOrientationToggle = () => {
    const temp = width;
    setWidth(height);
    setHeight(temp);
    setPreset("Custom");
  };

  const handleLinkToggle = () => {
    setLinked(!linked);
  };

  return (
    <div className="pointer-events-auto">
      <Dialog>
        <DialogTrigger>
          <Button size="icon" className="h-10 w-10 bg-stone-700">
            <Options20Regular className="h5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Canvas Options</DialogTitle>
            <DialogDescription>
              Set the dimensions and color of your drawing canvas.
            </DialogDescription>
          </DialogHeader>
          <div className="flex w-full flex-col items-start justify-start gap-6 py-2 align-middle">
            <div className="grid w-full max-w-sm items-center gap-2">
              <Label htmlFor="email">Size Preset</Label>
              <Select value={preset} onValueChange={handlePresetChange}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Screen size (default)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Screen</SelectLabel>
                    <SelectItem value="1920 x 1280">Screen size</SelectItem>
                    <SelectItem value="1280 x 720">HD</SelectItem>
                    <SelectItem value="1920 x 1080">Full HD</SelectItem>
                    <SelectItem value="2560 x 1440">2K QHD</SelectItem>
                    <SelectItem value="3840 x 2160">4K UHD</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>Print</SelectLabel>
                    <SelectItem value="2480 x 3508">Letter</SelectItem>
                    <SelectItem value="2551 x 3579">Legal</SelectItem>
                    <SelectItem value="1200 x 1800">4X6</SelectItem>
                    <SelectItem value="1500 x 2100">5X7</SelectItem>
                    <SelectItem value="2400 x 3000">8X10</SelectItem>
                    <SelectItem value="4961 x 3508">A3</SelectItem>
                    <SelectItem value="3508 x 2480">A4</SelectItem>
                    <SelectItem value="2480 x 1748">A5</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>Social</SelectLabel>
                    <SelectItem value="1080 x 1080">Square</SelectItem>
                    <SelectItem value="1350 x 1080">Portrait</SelectItem>
                    <SelectItem value="1200 x 628">Banner</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>{" "}
            </div>
            <div className="flex w-full flex-row items-start justify-start gap-4">
              <div className="flex w-fit flex-row items-start justify-start gap-2">
                <div className="grid w-full max-w-sm items-center gap-2">
                  <Label htmlFor="email">Width</Label>
                  <Input
                    value={width}
                    onChange={(e) =>
                      handleWidthChange(parseInt(e.target.value))
                    }
                    className="w-32"
                    type="number"
                    id="Width"
                    placeholder="1200"
                  />
                </div>
                <div className="mt-auto grid w-10 items-center justify-start">
                  <Toggle
                    onClick={handleLinkToggle}
                    variant="outline"
                    size="sm"
                    className="h-10 w-10"
                  >
                    <Link24Regular className="h5 w-5" />
                  </Toggle>
                </div>
                <div className="grid w-full max-w-sm items-center gap-2">
                  <Label htmlFor="email">Height</Label>
                  <Input
                    value={height}
                    onChange={(e) =>
                      handleHeightChange(parseInt(e.target.value))
                    }
                    className="w-32"
                    type="number"
                    id="Height"
                    placeholder="800"
                  />
                </div>
              </div>
              <div className="grid w-10 justify-start items-center mt-auto ml-0 mr-auto">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={handleOrientationToggle}
                >
                  <Orientation24Regular className="h5 w-5" />
                </Button>
              </div>
            </div>
            {/* BG Color selection popover control */}
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

{
  /* 
//BG Color selection popover control
            <div className="grid w-full max-w-sm items-center gap-2">
              <Label htmlFor="Background Color">Background Color</Label>
 <Popover>
                  <PopoverTrigger>
                    <div className="my-auto flex h-11 w-11 items-center justify-center p-2">
                      <div className="flex h-fit w-fit flex-row items-center justify-center rounded border border-[#5683DE] p-0">
                        <ColorSwatch
                          value={colorBG}
                          aria-label={`current color swatch with alpha channel: ${colorBG.toString(
                            "hsla"
                          )}`}
                        />
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="mr-16 ">
                    <div className=" flex h-fit w-fit  flex-col items-center justify-center rounded-lg p-1">
                      <div className="grid gap-4">
                        <div className="grid gap-4 mx-auto">
                          <div className="h-[0px]  w-[248px] inset-0 z-10">
                            <div className="relative h-[248px] w-[248px] p-0">
                              <ColorWheel
                                className=" inset-0 p-0"
                                value={colorBG}
                                onChange={setColorBG}
                              />
                            </div>
                          </div>
                          <div className="inset-0 mx-auto mt-[-16px] flex h-[248px] w-[248px] content-center justify-center p-[57px] align-middle">
                            <div className="inset-0 z-20 h-[134px] w-[134px] p-[0px]">
                              <ColorArea
                                aria-labelledby="hsb-label-id-1"
                                value={colorBG}
                                onChange={setColorBG}
                                isDisabled={false}
                                xChannel={sChannel}
                                yChannel={bChannel}
                              />
                            </div>
                          </div>
                        </div>
                        <ColorSlider
                          channel="alpha"
                          value={colorBG}
                          onChange={setColorBG}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                                     <div className="flex w-full flex-row items-center justify-start gap-4 pr-36"></div>
                      <div className="flex items-center space-x-2 py-4">
                        <Checkbox id="terms" />
                        <label
                          htmlFor="Set background as transparent"
                          className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Allow background transparency
                        </label>
                      </div>
                      
                      */
}
