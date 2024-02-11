import React, { ReactNode } from "react";
import { Card } from "./ui/card";

type Props = {
  children: ReactNode;
};

const BrushControlsFlyout: React.FC<Props> = ({ children }) => {
  return (
    <div className="absolute top-0 left-0 pt-40 pl-1 pointer-events-none">
      <Card className="ml-16 mt-0 overflow-hidden pointer-events-auto	">
        <div className="flex h-fit inset-y-0 w-fit max-w-[480px] flex-col items-start justify-start content-start py-8 px-8 gap-4">
          {children}
        </div>
      </Card>
    </div>
  );
};

export default BrushControlsFlyout;
