import React, { ReactNode } from "react";
import { Card } from "./ui/card";

type Props = {
  children: ReactNode;
};

const ColorSelectorWrapper: React.FC<Props> = ({ children }) => {
  return (
    <>
      <div className="absolute top-0 right-0 pt-2 pr-16 pointer-events-none">
        <Card className="p-2 w-[280px] pointer-events-auto	">
          <div className=" flex h-fit w-fit  flex-col items-center justify-center rounded-lg p-1">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Color</h4>
                <p className="text-sm text-muted-foreground hidden">
                  Set primary color.
                </p>
              </div>
              <div className="grid gap-4 mx-auto">{children}</div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default ColorSelectorWrapper;
