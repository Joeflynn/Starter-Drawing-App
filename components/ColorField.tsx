"use client";

import { useColorField, ColorFieldAria } from "@react-aria/color";
import { useColorFieldState, ColorFieldProps } from "@react-stately/color";
import React, { CSSProperties, useRef } from "react";
import { Color } from "@react-types/color";
import { parseColor } from "@react-stately/color";

import { cn } from "@/lib/utils";

console.log("");

function ColorField(props: ColorFieldProps) {
  let state = useColorFieldState(props);
  let inputRef = React.useRef(null);
  let { labelProps, inputProps } = useColorField(props, state, inputRef);

  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <label
        className='  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hidden'
        {...labelProps}
      >
        {props.label}
      </label>
      <input
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        )}
        {...inputProps}
        ref={inputRef}
      />
    </div>
  );
}

export default ColorField;
