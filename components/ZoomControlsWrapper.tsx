import React, { ReactNode } from "react";
import { Card } from "./ui/card";

type Props = {
  children: ReactNode;
};

const ZoomControlsWrapper: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Card className="pointer-events-auto w-36 px-2">
        <div className="flex w-full items-center justify-center space-x-[0px]">
          {children}
        </div>
      </Card>
    </>
  );
};

export default ZoomControlsWrapper;
