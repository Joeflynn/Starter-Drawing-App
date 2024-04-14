import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const CanvasWrapper: React.FC<Props> = ({ children }) => {
  return (
    <div className="inset-0 z-0 col-start-1 row-start-1 h-screen w-screen p-0">
      <div className=" m-auto flex h-full w-full grow items-center content-center justify-center p-0 inset-0">
        <div className="w-fit h-fit bg-checkerboard border border-slate-300 p-0 inset-0 cursor-crosshair">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CanvasWrapper;
