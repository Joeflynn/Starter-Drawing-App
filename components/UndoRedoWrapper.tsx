import React, { ReactNode } from "react";
import { Card } from "./ui/card";

type Props = {
  children: ReactNode;
};

const UndoRedoWrapper: React.FC<Props> = ({ children }) => {
  return (
    <>
      <div className="flex w-full flex-row items-center justify-center space-x-8">
        <Card className="pointer-events-auto w-24 px-1">
          <div className="flex w-full items-center justify-center space-x-[0px]">
            {children}
          </div>
        </Card>
      </div>
    </>
  );
};

export default UndoRedoWrapper;
