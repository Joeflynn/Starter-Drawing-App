import React, { useEffect, useRef } from "react";
import Image from "next/image";
import BrushStroke from "../public/brush-stroke-preview-example.jpg";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface BrushPreviewTileProps {
  brushName: string;
  isActive: boolean;
  imgPathURL: string;
}

export const BrushPreviewTile: React.FC<BrushPreviewTileProps> = ({
  brushName,
  imgPathURL,
  isActive,
}) => {
  const style = {
    Blob: isActive ? "bg-muted" : "bg-foreground",
  };
  return (
    <div
      className={
        "flex h-20 w-full flex-col items-center justify-start gap-0 rounded-lg border border-border p-1" +
        { Blob }
      }
    >
      <div className="mb-auto ml-auto mt-0 flex w-full flex-row items-center justify-end gap-2 p-2">
        <small className="text-end text-sm font-medium leading-none">
          {brushName}
        </small>
      </div>
      <AspectRatio
        ratio={23 / 7}
        className=" h-10 w-full pr-4 mix-blend-exclusion"
      >
        <Image
          // src={imgPathURL}
          src={BrushStroke}
          alt={{ brushName } + "Brush stroke preview example"}
          fill
          className="mb-0 h-10 w-full object-cover pr-4 mix-blend-multiply"
        />
      </AspectRatio>
    </div>
  );
};
