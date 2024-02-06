import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const TopBarWrapper: React.FC<Props> = ({ children }) => {
  return (
    <div className="w-full flex justify-between pt-3 px-3">{children}</div>
  );
};

export default TopBarWrapper;
