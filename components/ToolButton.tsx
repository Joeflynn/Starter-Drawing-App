"use client";

import {
  Blur24Regular,
  CircleImage24Regular,
  Cursor20Regular,
  Eraser24Regular,
  InkingTool24Regular,
  Lasso24Regular,
  PaintBucket24Regular,
  ShapeOrganic20Regular,
  Shapes24Regular,
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

type ToolButtonProps = {
  tool: string;
  isActive: boolean;
  onClick: () => void;
};

export function ToolButton({ tool, isActive, onClick }: ToolButtonProps) {
  const style = {
    borderWidth: isActive ? "1px" : "0px",
  };

  const renderIcon = () => {
    switch (tool) {
      case "brush":
        return <InkingTool24Regular className="h-5 w-5" />;
      case "eraser":
        return <Eraser24Regular className="h-5 w-5" />;
      case "smudge":
        return <Blur24Regular className="h-5 w-5" />;
      case "select":
        return <Cursor20Regular className="h-5 w-5" />;
      case "shapes":
        return <Shapes24Regular className="h-5 w-5" />;
      case "fill":
        return <PaintBucket24Regular className="h-5 w-5" />;
      case "freehand":
        return <ShapeOrganic20Regular className="h-5 w-5" />;
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
            <p> {tool} </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
