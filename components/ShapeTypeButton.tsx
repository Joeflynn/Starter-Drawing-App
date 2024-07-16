"use client";

import {
  ArrowUpRight20Regular,
  Blur24Regular,
  Circle20Regular,
  CircleImage24Regular,
  Cursor20Regular,
  Edit20Regular,
  Eraser24Regular,
  InkingTool24Regular,
  Lasso24Regular,
  Line20Regular,
  PaintBucket24Regular,
  Pentagon20Regular,
  ShapeOrganic20Regular,
  Shapes24Regular,
  Square20Regular,
  Star20Regular,
  Triangle20Regular,
} from "@fluentui/react-icons";

import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ToolButtonProps = {
  ShapeType: string;
  isShapeActive: boolean;
  onClick: () => void;
};

export function ShapeTypeButton({
  ShapeType,
  isShapeActive,
  onClick,
}: ToolButtonProps) {
  const style = {
    borderWidth: isShapeActive ? "1px" : "0px",
    backgroundColor: isShapeActive ? "rgba(100,100,180,0.2)" : "transparent",
  };

  const renderIcon = () => {
    switch (ShapeType) {
      case "Rectangle":
        return <Square20Regular className="h-5 w-5" />;
      case "Elipse":
        return <Circle20Regular className="h-5 w-5" />;
      case "Line":
        return <Line20Regular className="h-5 w-5" />;
      case "Polygon":
        return <Pentagon20Regular className="h-5 w-5" />;
      case "Arrow":
        return <ArrowUpRight20Regular className="h-5 w-5" />;
      case "Star":
        return <Star20Regular className="h-5 w-5" />;
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
              className="h-8 w-8 p-0"
            >
              {renderIcon()}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p> {ShapeType} </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
