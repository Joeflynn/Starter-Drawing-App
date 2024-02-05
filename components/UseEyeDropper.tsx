import { useState, useEffect } from "react";

interface PickedColor {
  sRGBHex: string;
}

const useEyeDropper = () => {
  const [color, setColor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  // Check support when the component mounts
  useEffect(() => {
    if (typeof window !== "undefined" && "EyeDropper" in window) {
      setIsSupported(true);
    }
  }, []);

  const pickColor = async () => {
    if (isSupported && typeof window !== "undefined") {
      const EyeDropper = (window as any).EyeDropper;
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

  return {
    color,
    error,
    isSupported,
    pickColor,
  };
};

export default useEyeDropper;
