"use client";

import { useTheme } from "next-themes";

import {
  Navigation24Filled,
  Drop24Regular,
  Drop24Filled,
  CircleHalfFill24Filled,
} from "@fluentui/react-icons";

import { Toggle } from "@/components/ui/toggle";

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

const DropdownAppMenu = () => {
  const { setTheme } = useTheme();
  return (
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
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default DropdownAppMenu;
