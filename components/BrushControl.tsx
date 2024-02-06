//functional component
import { Sidebar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  CalligraphyPen24Regular,
  Drop24Regular,
  Edit24Regular,
  InkStroke24Filled,
  MoreHorizontal24Filled,
  Open24Regular,
  Options24Filled,
  Options24Regular,
  PanelLeftExpand24Regular,
  Pen24Regular,
  Star24Regular,
} from "@fluentui/react-icons";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Separator } from "@/components/ui/separator";

import { Button, buttonVariants } from "@/components/ui/button";

import React from "react";
import { useState } from "react";
import { BrushSectionSidebar } from "@/components/BrushSectionSidebar";

const brushData = {
  brushes: [
    {
      brushName: "Round brush",
      isActive: false,
      imgPathURL: "/../public/brush-stroke-preview-example.jpg",
    },
    {
      brushName: "Soft brush",
      isActive: false,
      imgPathURL: "/../public/brush-stroke-preview-example.jpg",
    },
    {
      brushName: "Ink brush",
      isActive: false,
      imgPathURL: "/../public/brush-stroke-preview-example.jpg",
    },
    {
      brushName: "What brush",
      isActive: true,
      imgPathURL: "/../public/brush-stroke-preview-example.jpg",
    },
    {
      brushName: "Water Color",
      isActive: false,
      imgPathURL: "/../public/brush-stroke-preview-example.jpg",
    },
  ],
};

type BrushControlProps = {
  children: React.ReactNode;
};

const BrushControl: React.FC<BrushControlProps> = ({ children }) => {
  return (
    <div className=" flex h-full flex-col content-center justify-center items-center ">
      <div className="pointer-events-auto my-auto flex w-12 flex-col justify-center  content-center  space-y-8 rounded-lg border bg-card px-1 py-1 shadow-sm">
        <div className="mx-auto flex h-full w-full flex-col content-center justify-center space-y-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className=" h-10 w-10 p-2">
                <PanelLeftExpand24Regular className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent asChild className="ml-16 overflow-hidden">
              <div className="flex h-[547px] inset-y-0 w-fit max-w-[480px] flex-col items-center justify-center p-0">
                <div className="h-full w-full">
                  <div className="my-auto flex w-full flex-row items-between content-center justify-between py-2">
                    <h2 className="text-xl font-semibold"> Brush Studio </h2>
                    <Button variant="ghost" className="w-10 h-10 p-2 my-auto">
                      <MoreHorizontal24Filled className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex w-full items-start justify-center py-0 px-0 ">
                    <Separator />
                  </div>
                  <BrushSectionSidebar />
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {children}
        </div>
      </div>
    </div>
  );
};
export default BrushControl;
