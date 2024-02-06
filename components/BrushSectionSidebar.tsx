import Image from "next/image";

import { AspectRatio } from "@/components/ui/aspect-ratio";

import {
  CalligraphyPen24Regular,
  Drop24Regular,
  Edit24Regular,
  InkStroke24Filled,
  MoreHorizontal24Filled,
  PanelLeftExpand24Regular,
  Pen24Regular,
  Star24Regular,
} from "@fluentui/react-icons";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/VertTabs";

import { BrushPreviewTile } from "@/components/BrushPreviewTile";
import { ScrollArea } from "@radix-ui/react-scroll-area";

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

export function BrushSectionSidebar() {
  return (
    <Tabs
      defaultValue="basic"
      className="mx-auto mb-auto grid w-full grid-cols-12 content-start items-center justify-between gap-4 py-4"
      orientation="vertical"
    >
      <TabsList className="grid w-full grid-rows-4">
        <TabsList>
          <TabsTrigger
            value="basic"
            className="min-w-28 flex h-4 w-full flex-row items-center justify-start gap-2 p-0"
          >
            <Pen24Regular className="h-4 w-4" />
            <small className="text-sm font-bold leading-none">Basic</small>
          </TabsTrigger>
          <TabsTrigger
            value="sketching"
            className="min-w-28 flex h-4 w-full flex-row items-center justify-start gap-2 p-0"
          >
            <Pen24Regular className="h-4 w-4" />
            <small className="text-sm font-bold leading-none">
              Sketching
            </small>{" "}
          </TabsTrigger>
          <TabsTrigger
            value="painting"
            className="min-w-28 flex h-4 w-full flex-row items-center justify-start gap-2 p-0"
          >
            <Pen24Regular className="h-4 w-4" />
            <small className="text-sm font-bold leading-none">Painting</small>
          </TabsTrigger>
        </TabsList>
      </TabsList>
      <TabsContent value="basic">
        <ScrollArea className="col-span-8 ">
          <div className="col-span-8 flex w-full flex-col items-start justify-center gap-1 px-0 ">
            {brushData.brushes.map((brush, index) => (
              // Mapping over the brushes and rendering the BrushPreviewTile component for each brush
              <BrushPreviewTile
                key={index}
                brushName={brush.brushName}
                imgPathURL={brush.imgPathURL}
                isActive={brush.isActive}
              />
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
      <TabsContent value="sketching">
        <ScrollArea className="col-span-8 ">
          <div className="col-span-8 flex w-full flex-col items-start justify-center gap-1 px-0 ">
            {brushData.brushes.map((brush, index) => (
              // Mapping over the brushes and rendering the BrushPreviewTile component for each brush
              <BrushPreviewTile
                key={index}
                brushName={brush.brushName}
                imgPathURL={brush.imgPathURL}
                isActive={brush.isActive}
              />
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
      <TabsContent value="painting"></TabsContent>
    </Tabs>
  );
}
