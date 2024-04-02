import { use, useEffect, useRef, useState } from "react";

interface DrawingCanvasProps {
  brushColor: string;
  brushWidth: number;
  canvasWidth: number;
  canvasHeight: number;
  canvasColor: string;
  brushFlow: number;
  brushSoftness: number;
  activeTool: string;
  pressureSize: boolean;
  pressureOpacity: boolean;
  brushOpacity: number;
  brushRotation: number;
  brushSpacing: number;
  brushFlowJitter: number;
  brushSizeJitter: number;
  brushRotationJitter: number;
  brushScatter: number;
  brushTangentJitter: number;
  brushNormalJitter: number;
  shouldExport: boolean;
  onExportDone: () => void;
  shouldUndo: boolean;
  onUndoDone: () => void;
  shouldRedo: boolean;
  onRedoDone: () => void;
  shouldZoomIn: boolean;
  onZoomInDone: () => void;
  shouldZoomOut: boolean;
  onZoomOutDone: () => void;
}

export const Canvas: React.FC<DrawingCanvasProps> = ({
  brushColor,
  brushWidth,
  canvasWidth,
  canvasHeight,
  canvasColor,
  brushFlow,
  brushSoftness,
  activeTool,
  pressureSize,
  pressureOpacity,
  shouldExport,
  onExportDone,
  shouldUndo,
  onUndoDone,
  shouldRedo,
  onRedoDone,
  brushSpacing,
  brushTangentJitter,
  brushNormalJitter,
  brushFlowJitter,
  brushSizeJitter,
  brushRotationJitter,
  brushScatter,
  brushOpacity,
  brushRotation,
  shouldZoomIn,
  onZoomInDone,
  shouldZoomOut,
  onZoomOutDone,
}) => {
  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const zoomFactor = 1.1;

  const canvasStates = useRef<Array<ImageData>>([]);

  const brushColor1Rgba = hexToRgba(brushColor, brushOpacity);
  const brushColor2Rgba = hexToRgba(brushColor, brushOpacity / 2);
  const brushColor3Rgba = hexToRgba(brushColor, 0.0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(
    null
  );

  const [isErasing, setIsErasing] = useState<boolean>(false);
  const [isSmudging, setIsSmudging] = useState<boolean>(false);

  const brushCanvas = document.createElement("canvas");
  const brushCtx = brushCanvas.getContext("2d", {
    willReadFrequently: true,
  })!;

  const [zoomLevel, setZoomLevel] = useState(1);
  const [xPosOffset, setXPosOffset] = useState(0);
  const [yPosOffset, setYPosOffset] = useState(0);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d", {
        willReadFrequently: true,
      })!;
      ctx.fillStyle = canvasColor;
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.scale(zoomLevel, zoomLevel);
    }
  }, [canvasColor, canvasHeight, canvasWidth, zoomLevel]);

  const zoomIn = () => {
    setZoomLevel((prevZoomLevel) => prevZoomLevel + 0.1);
  };

  const zoomOut = () => {
    setZoomLevel((prevZoomLevel) => prevZoomLevel - 0.1);
  };

  useEffect(() => {
    setIsErasing(activeTool === "eraser");
  }, [activeTool]);

  useEffect(() => {
    setIsSmudging(activeTool === "smudge");
  }, [activeTool]);

  const distanceBetween = (
    point1: { x: number; y: number },
    point2: { x: number; y: number }
  ) => {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
  };

  const angleBetween = (
    point1: { x: number; y: number },
    point2: { x: number; y: number }
  ) => {
    return Math.atan2(point2.x - point1.x, point2.y - point1.y);
  };

  const [smudge, setSmudge] = useState<ImageData | null>(null);

  const createFeatherGradient = (radius: number, softness: number) => {
    const gradient = brushCtx.createRadialGradient(
      radius,
      radius,
      radius * softness,
      radius,
      radius,
      radius
    );
    gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    return gradient;
  };

  const [copy, setCopy] = useState<ImageData | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const rect = canvasRef.current!.getBoundingClientRect();
    const currentPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setLastPoint(currentPoint);
    const ctx = canvasRef.current!.getContext("2d")!;
    const copyWidth = brushWidth;
    const copyHeight = brushWidth;
    const copyX = currentPoint.x - copyWidth / 2;
    const copyY = currentPoint.y - copyHeight / 2;
    const initialCopy = ctx.getImageData(copyX, copyY, copyWidth, copyHeight);
    setCopy(initialCopy);

    const imageData = ctx.getImageData(
      0,
      0,
      canvasRef.current!.width,
      canvasRef.current!.height
    );

    canvasStates.current.push(imageData);
  };
  // Export the canvas as a jpg when shouldExport is true

  useEffect(() => {
    if (shouldExport) {
      // Implement your image export logic here
      const dataUrl = canvasRef.current!.toDataURL("image/jpeg");
      const link = document.createElement("a");
      link.download = "canvas.jpg";
      link.href = dataUrl;
      link.click();
      console.log("Exporting image...");

      // After exporting, call onExportDone to reset the state in the parent
      onExportDone();
    }
  }, [shouldExport, onExportDone]);

  // Assume we have a redoStates ref similar to canvasStates
  const redoStates = useRef<ImageData[]>([]);

  // Undo the last action when shouldUndo is true
  useEffect(() => {
    if (shouldUndo) {
      const ctx = canvasRef.current!.getContext("2d")!;
      const lastState = canvasStates.current.pop();
      if (lastState) {
        // Push the current state to the redo stack before undoing
        redoStates.current.push(
          ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
        );
        ctx.putImageData(lastState, 0, 0);
      }
      console.log("Undoing last action...");

      // After undoing, call onUndoDone to reset the state in the parent
      onUndoDone();
    }
  }, [shouldUndo, onUndoDone]);

  // Redo the last undone action when shouldRedo is true
  useEffect(() => {
    if (shouldRedo) {
      const ctx = canvasRef.current!.getContext("2d", {
        willReadFrequently: true,
      })!;

      const lastRedoState = redoStates.current.pop();
      if (lastRedoState) {
        // Push the current state to the undo stack before redoing
        canvasStates.current.push(
          ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
        );
        ctx.putImageData(lastRedoState, 0, 0);
      }
      console.log("Redoing last action...");

      // After redoing, call onRedoDone to reset the state in the parent
      onRedoDone();
    }
  }, [shouldRedo, onRedoDone]);

  useEffect(() => {
    const ctx = canvasRef.current!.getContext("2d")!;

    const lastState = canvasStates.current[canvasStates.current.length - 1];
    if (lastState) {
      // Resize the canvas
      ctx.canvas.width = canvasWidth;
      ctx.canvas.height = canvasHeight;

      // Put the last state on the canvas
      ctx.putImageData(lastState, 0, 0);
    }
  }, [canvasHeight, canvasWidth]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctx = canvasRef.current!.getContext("2d")!;
      if ((e.key === "z" || e.key === "Z") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        // If Ctrl/Cmd+Z is pressed, restore the last state from the stack
        const lastState = canvasStates.current.pop();
        if (lastState) {
          ctx.putImageData(lastState, 0, 0);
        }
        console.log("DrawingCanvas.tsx: handleKeyDown: Ctrl/Cmd+Z pressed");
      } else if ((e.key === "s" || e.key === "S") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        // If Ctrl/Cmd+S is pressed, save the canvas as a jpg
        const dataUrl = canvasRef.current!.toDataURL("image/jpeg");
        const link = document.createElement("a");
        link.download = "canvas.jpg";
        link.href = dataUrl;
        link.click();
        console.log("DrawingCanvas.tsx: handleKeyDown: Ctrl/Cmd+S pressed");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const spacingRatio = brushSpacing / 10; // Set the spacing between stamps as a ratio of the brush size
    const jitterTangent = brushTangentJitter * 100; // Set the maximum offset along the direction of the line (tangential)
    const jitterNormal = brushNormalJitter * 100; // Set the maximum offset perpendicular to the direction of the line (normal)
    const jitterSize = brushSizeJitter * 100; // Set the maximum variation in the size of the stamp
    const softness = brushSoftness + 0.001; // Set the softness of the brush

    if (!isDrawing) return;

    const rect = canvasRef.current!.getBoundingClientRect();
    const currentPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const dist = distanceBetween(lastPoint!, currentPoint);
    const angle = angleBetween(lastPoint!, currentPoint);
    let pressure = e.pressure;

    // Check for invalid pressure values and log detailed information
    if (isNaN(pressure) || pressure < 0 || pressure > 1) {
      console.warn("Invalid pressure value detected:", pressure, "Event:", e);
      pressure = 0.5; // Fallback value
    }

    // Clamp pressure to a valid range
    pressure = Math.max(0.001, Math.min(pressure, 1));
    const randomSize = Math.random() * jitterSize - jitterSize / 2;

    const brushSize = brushWidth * pressure + randomSize;
    const stampSpacing = brushWidth * spacingRatio; // Calculating the spacing between stamps based on the ratio

    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.lineJoin = ctx.lineCap = "round";
    ctx.globalAlpha = pressure * 2 * brushFlow;

    // Check if erasing mode is on
    if (isErasing) {
      ctx.globalCompositeOperation = "destination-out";
      console.log(
        "DrawingCanvas.tsx: handlePointerMove: isErasing: " + isErasing
      );
    } else {
      ctx.globalCompositeOperation = "source-over";
    }

    if (isSmudging) {
      // Perform the smudge effect
      const prevPoint = lastPoint!;
      const dist = distanceBetween(prevPoint, currentPoint);
      const angle = angleBetween(prevPoint, currentPoint);

      // Set up the feathered brush
      const radius = brushSize / 2;
      brushCanvas.width = brushSize;
      brushCanvas.height = brushSize;
      brushCtx.clearRect(0, 0, brushSize, brushSize);
      brushCtx.globalCompositeOperation = "source-over";

      let tempCanvas = document.createElement("canvas");
      let tempCtx = tempCanvas.getContext("2d", {
        willReadFrequently: true,
      });

      if (tempCtx !== null && copy !== null) {
        tempCanvas.width = copy.width;
        tempCanvas.height = copy.height;
        tempCtx.putImageData(copy, 0, 0);
        //  tempCtx.globalAlpha = pressure * brushFlow;
        brushCtx.drawImage(tempCanvas, 0, 0);
      }

      // Apply the feathered effect to the brush canvas
      //brushCtx.globalAlpha = pressure * brushFlow;
      brushCtx.globalCompositeOperation = "destination-in";
      brushCtx.fillStyle = createFeatherGradient(radius, brushSoftness);
      brushCtx.fillRect(0, 0, brushSize, brushSize);

      // Define the step size for iterating over the distance
      const stepSize = 3; // Adjust this value as needed

      for (let i = 0; i < dist; i += stepSize) {
        const x = prevPoint.x + Math.sin(angle) * i;
        const y = prevPoint.y + Math.cos(angle) * i;

        // Draw the feathered brush at the current position
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(brushCanvas, x - radius, y - radius);

        // Capture a new copy of the canvas at the current position
        const newCopyX = x - radius;
        const newCopyY = y - radius;
        const newCopy = ctx.getImageData(
          newCopyX,
          newCopyY,
          brushSize,
          brushSize
        );
        setCopy(newCopy);
      }
    } else {
      for (let i = 0; i < dist; i += stampSpacing) {
        const randomTangent = Math.random() * jitterTangent - jitterTangent / 2;
        const randomNormal = Math.random() * jitterNormal - jitterNormal / 2;

        const x =
          lastPoint!.x +
          Math.sin(angle) * i +
          Math.sin(angle) * randomTangent -
          Math.cos(angle) * randomNormal;
        const y =
          lastPoint!.y +
          Math.cos(angle) * i +
          Math.cos(angle) * randomTangent +
          Math.sin(angle) * randomNormal;

        const radgrad = ctx.createRadialGradient(
          x,
          y,
          brushSize / 4,
          x,
          y,
          brushSize / 2
        );

        radgrad.addColorStop(0, brushColor1Rgba);
        radgrad.addColorStop(brushSoftness, brushColor2Rgba);
        radgrad.addColorStop(1, brushColor3Rgba);

        ctx.fillStyle = radgrad;
        ctx.fillRect(
          x - brushSize / 2,
          y - brushSize / 2,
          brushSize,
          brushSize
        );
      }
    }

    setLastPoint(currentPoint);
  };

  useEffect(() => {
    const currentCanvasRef = canvasRef.current;

    return () => {
      if (currentCanvasRef) {
        const ctx = currentCanvasRef.getContext("2d");
        if (ctx) {
          ctx.globalCompositeOperation = "source-over";
        }
      }
    };
  }, []);
  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      style={{ touchAction: "none" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    />
  );
};

export default Canvas;
