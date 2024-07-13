"use client";

import Canvas from "@/components/Canvas";
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";

import MenuBar from "@/components/TopBar";
//import { ColorSelector } from "./ColorSelector";
import { Card } from "@/components/ui/card";
import { Color, parseColor, useColorSliderState } from "@react-stately/color";
import colorData from "../Assets/colorpalettes.json";
import UseEyeDropper from "@/components/UseEyeDropper";
import hexToHsv from "../lib/colorUtils";
import ColorArea from "@/components/ColorArea";
import ColorField from "@/components/ColorField";
import ColorSwatch from "@/components/ColorSwatch";
import { ColorWheel } from "@/components/ColorWheel";
import {
  Add16Filled,
  ArrowRedo24Filled,
  ArrowUndo24Filled,
  Eyedropper24Filled,
  InkStroke24Filled,
  Options24Regular,
  Navigation24Filled,
  Drop24Regular,
  Drop24Filled,
  CircleHalfFill24Filled,
  WeatherSunny24Regular,
  WeatherMoon24Regular,
  System24Regular,
  DarkTheme24Regular,
  Cut24Regular,
  Copy24Regular,
  ClipboardPaste24Regular,
  Cut16Filled,
  Copy16Regular,
  Toolbox20Regular,
  WrenchScrewdriver20Regular,
} from "@fluentui/react-icons";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

import { ColorChannel } from "@react-types/color";
import { ToolButton } from "@/components/ToolButton";
import BrushSlider from "@/components/BrushSlider";
import BrushControl from "@/components/BrushControl";
import { Checkbox } from "@/components/ui/checkbox";
import LabeledSlider from "@/components/LabeledSlider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Separator } from "@/components/ui/separator";
import { Droplet, Highlighter, MinusIcon } from "lucide-react";
import TopBarWrapper from "@/components/TopBarWrapper";
import ColorSelectorWrapper from "@/components/ColorSelectorWrapper";
import CanvasWrapper from "@/components/CanvasWrapper";
import BottomBarWrapper from "@/components/BottomBarWrapper";
import ZoomControlsWrapper from "@/components/ZoomControlsWrapper";
import UndoRedoWrapper from "@/components/UndoRedoWrapper";
import MainAreaWrapper from "@/components/MainAreaWrapper";
import DropdownAppMenu from "@/components/DropdownAppMenu";
import BrushControlsFlyout from "@/components/BrushControlsFlyout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import dynamic from "next/dynamic";

import { CanvasSettings } from "@/components/CanvasSettings";
import { ShapeButton } from "@/components/ShapeButton";

// Then you can use <ClientSideComponent /> in your main component

export default function Home() {
  const [brushFlow, setBrushFlow] = useState(0.25);
  let [brushSize, setBrushSize] = React.useState(200);
  let [brushSoftness, setBrushSoftness] = React.useState(0.5);
  let [brushOpacity, setBrushOpacity] = React.useState(1.0);
  let [brushRotation, setBrushRotation] = React.useState(0.0);
  let [brushSpacing, setBrushSpacing] = React.useState(0.9);
  let [brushBlendMode, setBrushBlendMode] = React.useState("normal");
  let [brushFlowJitter, setBrushFlowJitter] = React.useState(0.0);
  let [brushSizeJitter, setBrushSizeJitter] = React.useState(0.01);
  let [brushRotationJitter, setBrushRotationJitter] = React.useState(0.0);
  let [brushScatter, setBrushScatter] = React.useState(0.0);
  let [brushTangentJitter, setBrushTangentJitter] = React.useState(0.01);
  let [brushNormalJitter, setBrushNormalJitter] = React.useState(0.01);
  let [pressureSize, setPressureSize] = React.useState(true);
  let [pressureOpacity, setPressureOpacity] = React.useState(true);

  const [canvasWidth, setCanvasWidth] = useState(1200);
  const [canvasHeight, setCanvasHeight] = useState(800);
  const [preset, setPreset] = useState("HD");
  const [linked, setLinked] = useState(false);

  let [color, setColor] = React.useState(
    parseColor("hsba(219, 58%, 93%, 0.75)")
  );

  let [colorBG, setColorBG] = React.useState(
    parseColor("hsba(0, 0%, 100%, 1)")
  );

  let [endColor, setEndColor] = React.useState(color);
  let [hChannel, sChannel, bChannel] = color.getColorChannels();

  const {
    color: eyedropperColor,
    error,
    isSupported,
    pickColor,
  } = UseEyeDropper();

  const handleColorChange = (newColor: Color | null) => {
    if (newColor !== null) {
      setColor(newColor);
    }
  };

  const tools = [
    "brush",
    "eraser",
    "smudge",
    "select",
    "shapes",
    "fill",
    "freehand",
  ];
  const [activeTool, setActiveTool] = useState<string>(tools[0]);

  const [showBrushControls, setShowBrushControls] = useState(false);

  const [isAltKeyDown, setAltKeyDown] = useState<boolean>(false);
  const [isShiftKeyDown, setShiftKeyDown] = useState<boolean>(false);

  let [shapeStrokeColor, setShapeStrokeColor] = React.useState("0x000000");
  let [shapeStrokeWidth, setShapeStrokeWidth] = React.useState(5);
  let [shapeStrokeAlpha, setShapeStrokeAlpha] = React.useState(1);
  let [shapeFillColor, setShapeFillColor] = React.useState("0xfff000");
  let [shapeFillAlpha, setShapeFillAlpha] = React.useState(1);
  let [shapeCornerRadius, setShapeCornerRadius] = React.useState(12);
  let [shapeInnerRadius, setShapeInnerRadius] = React.useState(24);
  let [shapeOuterRadius, setShapeOuterRadius] = React.useState(48);
  let [shapePointCount, setShapePointCount] = React.useState(7);
  let [shapeSidesCount, setShapeSidesCount] = React.useState(5);
  let [shapeHoleInnerRadius, setShapeHoleInnerRadius] = React.useState(64);
  let [shapeHoleOuterRadius, setShapeHoleOuterRadius] = React.useState(48);

  const shapes = [
    "customPolygon",
    "lasso",
    "polygon",
    "rectangle",
    "roundedRectangle",
    "elipse",
    "star",
    "burst",
    "gear",
    "arc",
    "torus",
    "filletRectangle",
    "chamferRectangle",
    "line",
  ];
  const [shapeType, setShapeType] = useState<string>(shapes[1]);

  const renderActiveToolOptions = () => {
    switch (activeTool) {
      case "brush":
        return (
          <div>
            <p> Brush </p>
          </div>
        );
      case "eraser":
        return (
          <div>
            <p> Eraser </p>
          </div>
        );
      case "smudge":
        return (
          <div>
            <p> Smudge </p>
          </div>
        );
      case "select":
        return (
          <div>
            <p> Select </p>
          </div>
        );
      case "shapes":
        return (
          <div className="grid w-full gap-2">
            <h4 className="font-medium leading-none">Shape Options</h4>
            <LabeledSlider
              label="Stroke width"
              defaultValue={2}
              minValue={0}
              maxValue={10}
              step={1}
            />
            <Label htmlFor="email">Stroke width</Label>
            <Input
              value={1}
              className="w-32"
              type="number"
              id="Height"
              placeholder="5"
            />
            <Label htmlFor="email">Points</Label>
            <Input
              value={1}
              className="w-32"
              type="number"
              id="Height"
              placeholder="5"
            />
            <Label htmlFor="email">Sides</Label>
            <Input
              value={5}
              className="w-32"
              type="number"
              id="Height"
              placeholder="5"
            />
            <Label htmlFor="email">Radius</Label>
            <Input
              value={40}
              className="w-32"
              type="number"
              id="Height"
              placeholder="5"
            />
            <Label htmlFor="email">Inner radius</Label>
            <Input
              value={1}
              className="w-32"
              type="number"
              id="Height"
              placeholder="5"
            />
          </div>
        );
      case "fill":
        return (
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="email">Fill tolerance</Label>
            <Input
              value={10}
              className="w-32"
              type="number"
              id="Height"
              placeholder="5"
            />
          </div>
        );
      case "freehand":
        return (
          <div className="grid w-full max-w-sm items-center gap-2">
            <LabeledSlider
              label="Smoothing"
              defaultValue={2}
              minValue={0}
              maxValue={10}
              step={1}
            />
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (eyedropperColor) {
      const hsv = hexToHsv(eyedropperColor);
      if (hsv && !isNaN(hsv.h) && !isNaN(hsv.s) && !isNaN(hsv.v)) {
        setColor(parseColor(`hsb(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`));
      }
    }
  }, [eyedropperColor]);
  const [showColorSelector, setShowColorSelector] = useState(false);
  const [showToolOptions, setShowToolOptions] = useState(false);

  const [shouldExport, setShouldExport] = useState(false);

  const handleExport = () => {
    setShouldExport(true);
  };

  const [shouldUndo, setShouldUndo] = useState(false);

  const handleUndo = () => {
    setShouldUndo(true);
  };

  const [shouldRedo, setShouldRedo] = useState(false);

  const handleRedo = () => {
    setShouldRedo(true);
  };

  const [shouldZoomIn, setShouldZoomIn] = useState(false);

  const handleZoomIn = () => {
    setShouldZoomIn(true);
  };

  const [shouldZoomOut, setShouldZoomOut] = useState(false);

  const handleZoomOut = () => {
    setShouldZoomOut(true);
  };

  const { setTheme } = useTheme();

  return (
    <main className="grid h-screen w-screen grid-cols-1 grid-rows-1 touch-none p-0 bg-canvas overflow-hidden">
      <div className="pointer-events-none inset-0 z-10 col-start-1 row-start-1 flex h-full w-full flex-col items-start">
        <TopBarWrapper>
          <nav className="w-fit pointer-events-auto">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Toggle
                  className="h-11 w-11 border border-border bg-card p-3"
                  aria-label="Toggle text tool"
                >
                  <Navigation24Filled className="h-5 w-5 " />
                </Toggle>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>File</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Open</DropdownMenuItem>

                <DropdownMenuItem>Save</DropdownMenuItem>
                <DropdownMenuItem>Save as</DropdownMenuItem>
                <DropdownMenuItem onClick={handleExport}>
                  Export
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuLabel>System</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <DarkTheme24Regular className="mr-2 h-4 w-4" />
                    <span>Theme</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setTheme("system")}>
                        <System24Regular className="mr-2 h-4 w-4" />
                        <span>Systen</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("dark")}>
                        <WeatherMoon24Regular className="mr-2 h-4 w-4" />
                        <span>Dark</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("light")}>
                        <WeatherSunny24Regular className="mr-2 h-4 w-4" />
                        <span>Light</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Edit</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  {" "}
                  <Cut16Filled className="mr-2 h-4 w-4" />
                  <span>Cut</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {" "}
                  <Copy16Regular className="mr-2 h-4 w-4" />
                  <span>Copy</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {" "}
                  <ClipboardPaste24Regular className="mr-2 h-4 w-4" />
                  <span>Paste</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          <Card className="my-auto flex h-12 w-fit content-center items-center justify-between p-1">
            <div className="my-auto flex w-full content-center items-center justify-between gap-1 p-0 pointer-events-auto">
              {tools.map((tool) => (
                <ToolButton
                  key={tool}
                  tool={tool}
                  isActive={tool === activeTool}
                  onClick={() => setActiveTool(tool)}
                />
              ))}
            </div>
          </Card>
          {showToolOptions && (
            <div className="absolute top-0 right-0 pt-2 mr-16 pointer-events-none">
              <Card className="p-2 w-[312px] h-fit pointer-events-auto	">
                {" "}
                <div className=" flex h-fit w-full  flex-col items-center justify-center rounded-lg p-1">
                  <div className="grid gap-4 w-full">
                    <div className="space-y-2">{renderActiveToolOptions()}</div>
                  </div>
                </div>
              </Card>
            </div>
          )}
          <Toggle
            className="p-0 pointer-events-auto"
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
            <ColorSelectorWrapper>
              <div className=" w-full flex justify-between content-center h-6 py-0">
                <h4 className="font-medium leading-none">Color</h4>
                <div
                  className="h-6 w-8 rounded-md border border-border "
                  style={{
                    backgroundColor: color.toString("css"),
                  }}
                ></div>
              </div>
              <div className="h-[0px]  w-[248px] inset-0 z-10">
                <div className="relative h-[248px] w-[248px] p-0">
                  <ColorWheel value={color} onChange={setColor} />
                </div>
              </div>
              <div className="inset-0 mx-auto mt-[-16px] flex h-[248px] w-[248px] content-center justify-center p-[57px] align-middle">
                <div className="inset-0 z-20 h-[134px] w-[134px] p-[0px]">
                  <ColorArea
                    aria-labelledby="hsb-label-id-1"
                    value={color}
                    onChange={setColor}
                    isDisabled={false}
                    xChannel={sChannel}
                    yChannel={bChannel}
                  />
                </div>
              </div>
              <div className="my-auto flex w-full content-center items-center justify-between gap-4 px-0 py-2">
                {/* 
                      <div className="my-auto">
                        <ColorField
                          aria-labelledby="hsb-label-id-1"
                          value={color}
                          onChange={handleColorChange}
                          isDisabled={false}
                          label="Color"
                        />
                      </div>
                      */}
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
            </ColorSelectorWrapper>
          )}
        </TopBarWrapper>
        <MainAreaWrapper>
          <BrushControl>
            <div className="mx-auto flex h-full flex-col content-center space-y-5 py-2">
              <div className=" hidden ">
                {shapes.map((shapes) => (
                  <ShapeButton
                    key={shapes}
                    shapes={shapes}
                    isActive={shapes === shapeType}
                    onClick={() => setShapeType(shapes)}
                  />
                ))}
              </div>
              <InkStroke24Filled className="h-4 w-4" />
              <BrushSlider
                orientation="vertical"
                aria-label="Width"
                value={brushSize}
                onChange={setBrushSize}
                minValue={12}
                maxValue={400}
                step={1}
              />
              <CircleHalfFill24Filled className="h-4 w-4" />
              <BrushSlider
                orientation="vertical"
                aria-label="Flow"
                value={brushFlow}
                onChange={setBrushFlow}
                minValue={0.01}
                maxValue={0.5}
                step={0.01}
              />
            </div>
            <Toggle
              className=" h-10 w-10 p-2"
              onClick={() => setShowBrushControls(!showBrushControls)}
            >
              <Options24Regular className="h-5 w-5" />
            </Toggle>
            {showBrushControls && (
              <BrushControlsFlyout>
                <h3 className="font-semibold leading-none">Brush Settings</h3>
                <LabeledSlider
                  label="Hardness"
                  defaultValue={brushSoftness}
                  minValue={0.01}
                  maxValue={1}
                  step={0.01}
                  onChange={setBrushSoftness}
                />
                <LabeledSlider
                  label="Spacing"
                  defaultValue={brushSpacing}
                  minValue={0.1}
                  maxValue={1}
                  step={0.01}
                  onChange={setBrushSpacing}
                />
                <LabeledSlider label="Rotation" />
                <LabeledSlider
                  label="Flow jitter"
                  defaultValue={brushFlowJitter}
                  minValue={0}
                  maxValue={1}
                  step={0.01}
                  onChange={setBrushFlowJitter}
                />

                <LabeledSlider
                  label="Size jitter"
                  defaultValue={brushSizeJitter}
                  minValue={0.01}
                  maxValue={1}
                  step={0.01}
                  onChange={setBrushSizeJitter}
                />

                <LabeledSlider
                  label="Rotation jitter"
                  defaultValue={brushRotationJitter}
                  minValue={0}
                  maxValue={90}
                  step={1}
                  onChange={setBrushRotationJitter}
                />

                <LabeledSlider
                  label="Scatter"
                  defaultValue={brushScatter}
                  minValue={0}
                  maxValue={1}
                  step={0.01}
                  onChange={setBrushScatter}
                />

                <LabeledSlider
                  label="Tangent jitter"
                  defaultValue={brushTangentJitter}
                  minValue={0.01}
                  maxValue={1}
                  step={0.01}
                  onChange={setBrushTangentJitter}
                />

                <LabeledSlider
                  label="Normal jitter"
                  defaultValue={brushNormalJitter}
                  minValue={0.01}
                  maxValue={1}
                  step={0.01}
                  onChange={setBrushNormalJitter}
                />

                <LabeledSlider
                  label="Opacity"
                  defaultValue={brushOpacity}
                  minValue={0}
                  maxValue={1}
                  step={0.01}
                  onChange={setBrushOpacity}
                />

                <div className="items-top flex space-x-2">
                  <Checkbox
                    id="pressureSize"
                    aria-label="Pressure affects size"
                    defaultChecked={pressureSize}
                    onChange={() => setPressureSize(!pressureSize)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="pressureSize"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Size
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Pen pressure affects size
                    </p>
                  </div>
                </div>

                <div className="items-top flex space-x-2">
                  <Checkbox
                    id="pressureOpacity"
                    aria-label="Pressure affects size"
                    defaultChecked={true}
                    onChange={() => {}}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="pressureOpacity"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Opacity
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Pen pressure affects Opacity
                    </p>
                  </div>
                </div>
              </BrushControlsFlyout>
            )}
          </BrushControl>
          <div className=" mx-auto flex h-full max-w-full grow content-center justify-center">
            {" "}
          </div>
          <div className=" mx-auto flex h-full flex-col content-center space-y-5 py-2">
            <CanvasSettings
              width={canvasWidth}
              setWidth={setCanvasWidth}
              height={canvasHeight}
              setHeight={setCanvasHeight}
              preset={preset}
              setPreset={setPreset}
              linked={linked}
              setLinked={setLinked}
            />
            <Toggle
              className=" size-10 p-1 pointer-events-auto"
              onClick={() => setShowToolOptions(!showToolOptions)}
            >
              <WrenchScrewdriver20Regular className="h-5 w-5" />
            </Toggle>
          </div>
        </MainAreaWrapper>
        <BottomBarWrapper>
          <ZoomControlsWrapper>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Toggle aria-label="Toggle text tool" onClick={handleZoomIn}>
                    <Add16Filled className="h-5 w-5 " />
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                  <p> Zoom In </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Separator orientation="vertical" className="h-11 w-[1px] " />
            <div className="inset-y-0 grid h-11 w-[60px] content-center justify-center  bg-secondary px-3 py-0">
              <p className="text-muted-foreground">100%</p>
            </div>
            <Separator orientation="vertical" className="h-11 w-[1px] " />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Toggle aria-label="Toggle text tool" onClick={handleZoomOut}>
                    <MinusIcon className="h-5 w-5 " />
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                  <p> Zoom Out </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </ZoomControlsWrapper>
          <UndoRedoWrapper>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Toggle aria-label="Undo" onClick={handleUndo}>
                    <ArrowUndo24Filled className="h-5 w-5 pt-[2px]" />
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                  <p> Undo </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Separator orientation="vertical" className="h-11 w-[2px] " />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Toggle aria-label="Redo" onClick={handleRedo}>
                    <ArrowRedo24Filled className="h-5 w-5 pt-[1px]" />
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                  <p> Redo </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </UndoRedoWrapper>
        </BottomBarWrapper>
      </div>
      <CanvasWrapper>
        <Canvas
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          brushFlow={brushFlow}
          brushSoftness={brushSoftness}
          pressureOpacity={pressureOpacity}
          pressureSize={pressureSize}
          brushColor={color.toString("hex")}
          brushWidth={brushSize}
          canvasColor={"#ffffff"}
          activeTool={activeTool}
          brushOpacity={brushOpacity}
          brushRotation={brushRotation}
          brushSpacing={brushSpacing}
          brushFlowJitter={brushFlowJitter}
          brushSizeJitter={brushSizeJitter}
          brushRotationJitter={brushRotationJitter}
          brushScatter={brushScatter}
          brushTangentJitter={brushTangentJitter}
          brushNormalJitter={brushNormalJitter}
          shouldExport={shouldExport}
          onExportDone={() => setShouldExport(false)}
          shouldUndo={shouldUndo}
          onUndoDone={() => setShouldUndo(false)}
          shouldRedo={shouldRedo}
          onRedoDone={() => setShouldRedo(false)}
          shouldZoomIn={shouldZoomIn}
          onZoomInDone={() => setShouldZoomIn(false)}
          shouldZoomOut={shouldZoomOut}
          onZoomOutDone={() => setShouldZoomOut(false)}
          shapeStrokeColor={shapeStrokeColor}
          shapeStrokeWidth={shapeStrokeWidth}
          shapeStrokeAlpha={shapeStrokeAlpha}
          shapeFillColor={shapeFillColor}
          shapeFillAlpha={shapeFillAlpha}
          shapeCornerRadius={shapeCornerRadius}
          shapeInnerRadius={shapeInnerRadius}
          shapeOuterRadius={shapeOuterRadius}
          shapePointCount={shapePointCount}
          shapeSidesCount={shapeSidesCount}
          shapeHoleInnerRadius={shapeHoleInnerRadius}
          shapeHoleOuterRadius={shapeHoleOuterRadius}
          shapeType={shapeType}
          isAltKeyDown={isAltKeyDown}
          isShiftKeyDown={isShiftKeyDown}
        />
      </CanvasWrapper>
    </main>
  );
}
