"use client";

import {
  Blur24Regular,
  CircleImage24Regular,
  Cursor20Regular,
  Eraser24Regular,
  InkingTool24Regular,
} from "@fluentui/react-icons";

import { Card } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ShapeButtonProps = {
  shapes: string;
  isActive: boolean;
  onClick: () => void;
};

export function ShapeButton({ shapes, isActive, onClick }: ShapeButtonProps) {
  const style = {
    borderWidth: isActive ? "1px" : "0px",
  };

  const renderIcon = () => {
    switch (shapes) {
      case "rectangle":
        return <InkingTool24Regular className="h-5 w-5" />;
      case "Elipse":
        return <Eraser24Regular className="h-5 w-5" />;
      case "Polygon":
        return <Blur24Regular className="h-5 w-5" />;
      case "Line":
        return <Cursor20Regular className="h-5 w-5" />;
      case "roundedRectangle":
        return <CircleImage24Regular className="h-5 w-5" />;
      case "star":
        return <CircleImage24Regular className="h-5 w-5" />;
      case "burst":
        return <CircleImage24Regular className="h-5 w-5" />;
      case "gear":
        return <CircleImage24Regular className="h-5 w-5" />;
      case "arc":
        return <CircleImage24Regular className="h-5 w-5" />;
      case "torus":
        return <CircleImage24Regular className="h-5 w-5" />;
      case "filletRectangle":
        return <CircleImage24Regular className="h-5 w-5" />;
      case "chamferRectangle":
        return <CircleImage24Regular className="h-5 w-5" />;
      case "line":
        return <CircleImage24Regular className="h-5 w-5" />;
      case "customPolygon":
        return <CircleImage24Regular className="h-5 w-5" />;
      case "lasso":
        return <CircleImage24Regular className="h-5 w-5" />;

      default:
        return null;
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              style={style}
              onClick={onClick}
              className="h-10 w-10 p-2"
            >
              {renderIcon()}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p> {shapes} </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
