import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const MainAreaWrapper: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex grow w-full h-full items-center justify-center content-center ">
      <div className="inset-0 h-full w-full grow">
        <div className="flex h-full w-full flex-row justify-between px-3 content-center items-center">
          {" "}
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainAreaWrapper;
