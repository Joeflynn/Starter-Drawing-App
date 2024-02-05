"use client";

import { useState } from "react";

interface PickedColor {
  sRGBHex: string;
}

const useEyeDropper = () => {
  const [color, setColor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const EyeDropper = (window as any).EyeDropper;

  const checkSupport = () => {
    if ("EyeDropper" in window) {
      setIsSupported(true);
    }
  };

  const pickColor = async () => {
    if (isSupported) {
      const eyeDropper = new EyeDropper();
      try {
        const pickedColor: PickedColor = await eyeDropper.open();
        setColor(pickedColor.sRGBHex);
      } catch (error) {
        if (error instanceof Error) {
          setError(`Failed to pick the color: ${error.message}`);
        } else {
          setError(`Failed to pick the color: ${String(error)}`);
        }
      }
    }
  };

  return { color, error, checkSupport, pickColor };
};

export default useEyeDropper;
