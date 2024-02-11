import React, { createContext, useContext, useState } from "react";
import brushes from "../Assets/brush-settings.json";

type BrushContextType = {
  currentBrush: typeof brushes.brush1;
  setCurrentBrush: React.Dispatch<React.SetStateAction<typeof brushes.brush1>>;
};

const BrushContext = createContext<BrushContextType | null>(null);
type BrushProviderProps = {
  children: React.ReactNode;
};

export const BrushProvider = ({ children }: BrushProviderProps) => {
  const [currentBrush, setCurrentBrush] = useState(brushes.brush1);

  return (
    <BrushContext.Provider value={{ currentBrush, setCurrentBrush }}>
      {children}
    </BrushContext.Provider>
  );
};

export const useBrush = () => useContext(BrushContext);
