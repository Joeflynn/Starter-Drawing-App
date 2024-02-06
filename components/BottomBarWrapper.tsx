import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const BottomBarWrapper: React.FC<Props> = ({ children }) => {
  return (
    <>
      <div className="mr-auto flex w-auto flex-row items-center justify-start space-x-3 p-3">
        {children}
      </div>
    </>
  );
};

export default BottomBarWrapper;
