"use client";

import React, { use } from "react";
import { useEffect, useRef, useState } from "react";
import { ShapeDraw } from "@/lib/ShapeDraw";
import { circleCursor } from "@/lib/Cursor";

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
  shapeStrokeColor: string;
  shapeFillColor: string;
  shapeFillAlpha: number;
  shapeStrokeWidth: number;
  shapeStrokeAlpha: number;
  shapeType: string;
  shapeCornerRadius: number;
  shapeSidesCount: number;
  shapePointCount: number;
  shapeInnerRadius: number;
  shapeOuterRadius: number;
  shapeHoleInnerRadius: number;
  shapeHoleOuterRadius: number;
  isAltKeyDown: boolean;
  isShiftKeyDown: boolean;
  fillTolerance: number;
  brushShape: number;
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
  shapeStrokeColor,
  shapeFillColor,
  shapeFillAlpha,
  shapeStrokeWidth,
  shapeStrokeAlpha,
  shapeType,
  shapeCornerRadius,
  shapeSidesCount,
  shapePointCount,
  shapeInnerRadius,
  shapeOuterRadius,
  shapeHoleInnerRadius,
  shapeHoleOuterRadius,
  isAltKeyDown,
  isShiftKeyDown,
  fillTolerance,
  brushShape,
}) => {
  // Shapes state
  let [shapeStartPos, setShapeStartPos] = React.useState({ x: 0, y: 0 });
  let [shapeEndPos, setShapeEndPos] = React.useState({ x: 0, y: 0 });
  let [shapeCurrentPos, setShapeCurrentPos] = React.useState({
    x: 250,
    y: 250,
  });
  let [shapePoints, setShapePoints] = React.useState([]);
  let [shapePivotPos, setShapePivotPos] = React.useState({ x: 0, y: 0 });
  let [shapeWidth, setShapeWidth] = React.useState(0);
  let [shapeHeight, setShapeHeight] = React.useState(0);

  // Convert hex color to rgba utility function
  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Used to set the brush color with opacity and softness
  const brushColor1Rgba = hexToRgba(brushColor, brushOpacity);
  const brushColor2Rgba = hexToRgba(brushColor, brushOpacity / 2);
  const brushColor3Rgba = hexToRgba(brushColor, 0.0);
  const freehandColor = hexToRgba(brushColor, 1);

  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isErasing, setIsErasing] = useState<boolean>(false);
  const [isSmudging, setIsSmudging] = useState<boolean>(false);
  const [isCreatingShape, setCreatingShape] = useState<boolean>(false);
  const [isPainting, setIsPainting] = useState<boolean>(false);
  const [isFilling, setIsFilling] = useState<boolean>(false);
  const [isFreehand, setIsFreehand] = useState<boolean>(false);
  const [isPencil, setIsPencil] = useState<boolean>(false);

  useEffect(() => {
    setIsPainting(activeTool === "brush");
  }, [activeTool]);

  useEffect(() => {
    setIsErasing(activeTool === "eraser");
  }, [activeTool]);

  useEffect(() => {
    setIsSmudging(activeTool === "smudge");
  }, [activeTool]);

  useEffect(() => {
    setIsPencil(activeTool === "pencil");
  }, [activeTool]);

  useEffect(() => {
    setCreatingShape(activeTool === "shapes");
  }, [activeTool]);

  useEffect(() => {
    setIsFilling(activeTool === "fill");
  }, [activeTool]);

  useEffect(() => {
    setIsFreehand(activeTool === "freehand");
  }, [activeTool]);

  // Used to store the canvas state for export, undo, and redo functionality
  const canvasStates = useRef<Array<ImageData>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  //quick shape tool test
  //const [isCreatingShape, setIsCreatingShape] = useState(false);
  const [shapeStartPoint, setShapeStartPoint] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [shapeEndPoint, setShapeEndPoint] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // brushCanvas and brushCtx are used to create the feathered brush tip for the smudge tool

  const [brushCanvas, setBrushCanvas] = useState<HTMLCanvasElement | null>(
    null
  );
  const [brushCtx, setBrushCtx] = useState<CanvasRenderingContext2D | null>(
    null
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", {
        willReadFrequently: true,
      });
      setBrushCanvas(canvas);
      setBrushCtx(ctx);
    }
  }, []);

  //PENCIL TOOL UTILITIES

  interface Point {
    x: number;
    y: number;
  }

  //DROP IMAGE INTO CANVAS
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawImageOnCanvas = (img: HTMLImageElement) => {
      const scaleFactor = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      );
      const newWidth = img.width * scaleFactor;
      const newHeight = img.height * scaleFactor;
      const x = (canvas.width - newWidth) / 2;
      const y = (canvas.height - newHeight) / 2;

      ctx.drawImage(img, x, y, newWidth, newHeight);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();

      if (e.dataTransfer?.files) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => drawImageOnCanvas(img);
            img.src = event.target?.result as string;
          };
          reader.readAsDataURL(file);
        }
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
              const reader = new FileReader();
              reader.onload = (event) => {
                const img = new Image();
                img.onload = () => drawImageOnCanvas(img);
                img.src = event.target?.result as string;
              };
              reader.readAsDataURL(blob);
            }
          }
        }
      }
    };

    canvas.addEventListener("drop", handleDrop);
    canvas.addEventListener("dragover", handleDragOver);
    document.addEventListener("paste", handlePaste);

    return () => {
      canvas.removeEventListener("drop", handleDrop);
      canvas.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  // CANVAS BACKGROUND COLOR

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d", {
        willReadFrequently: true,
      })!;
      ctx.fillStyle = canvasColor;
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [canvasColor, canvasHeight, canvasWidth]);

  // Test star shape
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const activeShape = new ShapeDraw(ctx);
        // Star
        activeShape.drawStar(
          shapeCurrentPos.x,
          shapeCurrentPos.y,
          shapePointCount,
          shapeInnerRadius,
          shapeOuterRadius,
          shapeFillColor,
          shapeStrokeColor,
          shapeStrokeWidth,
          shapeStrokeAlpha,
          shapeFillAlpha
        );
      }
    }
  }, [
    shapeFillColor,
    shapeStrokeColor,
    shapeStrokeWidth,
    shapeStrokeAlpha,
    shapeFillAlpha,
    shapeCornerRadius,
    shapeInnerRadius,
    shapeOuterRadius,
    shapePointCount,
    shapeSidesCount,
    shapeType,
    shapeCurrentPos,
  ]);

  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(
    null
  );

  // DRAWING UTILITY FUNCTIONS

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
  //Lasso variables
  const [isLassoActive, setIsLassoActive] = useState(false);
  const [lassoPoints, setLassoPoints] = useState<
    Array<{ x: number; y: number }>
  >([]);

  //Pencil variables
  const [isPencilActive, setIsPencilActive] = useState(false);
  //const [pencilPoints, setPencilPoints] = useState<
  //   Array<{ x: number; y: number }>
  // >([]);
  const pencilPoints = useRef<Point[]>([]);

  function midPointBtw(
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ) {
    return {
      x: p1.x + (p2.x - p1.x) / 2,
      y: p1.y + (p2.y - p1.y) / 2,
    };
  }

  // LOGIC FOR CREATING THE FEATHERED GRADIENT BRUSH TIP FOR THE SMUDGE TOOL

  const createFeatherGradient = (radius: number, softness: number) => {
    const gradient = brushCtx?.createRadialGradient(
      radius,
      radius,
      radius * softness,
      radius,
      radius,
      radius
    );
    if (gradient) {
      gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    } else {
      // add an error message here
      throw new Error("Failed to create radial gradient");
    }
    return gradient;
  };

  const [copy, setCopy] = useState<ImageData | null>(null);

  useEffect(() => {
    console.log(pressureSize);
  }, [pressureSize]);

  const createScalableRadialGradient = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    brushSize: number,
    brushSoftness: number,
    scaleX: number = 1,
    scaleY: number = 1,
    rotation: number = 0,
    brushColor1Rgba: string,
    brushColor2Rgba: string,
    brushColor3Rgba: string
  ) => {
    brushSize = Math.max(0, brushSize);
    const radiusX = (brushSize / 2) * scaleX;
    const radiusY = (brushSize / 2) * scaleY;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    const gradient = ctx.createRadialGradient(
      0,
      0,
      brushSize / Math.max(4, (1 - brushSoftness) * 10),
      0,
      0,
      Math.max(radiusX, radiusY)
    );

    gradient.addColorStop(0, brushColor1Rgba);
    gradient.addColorStop(brushSoftness, brushColor2Rgba);
    gradient.addColorStop(1, brushColor3Rgba);

    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // EXPORT IMAGE UNDO REDO START

  useEffect(() => {
    if (shouldExport) {
      // Implement your image export logic here
      const dataUrl = canvasRef.current!.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "canvas.png";
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
        const dataUrl = canvasRef.current!.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "canvas.png";
        link.href = dataUrl;
        link.click();
        console.log("DrawingCanvas.tsx: handleKeyDown: Ctrl/Cmd+S pressed");
      }
    };

    // Check if window is defined (i.e., we're on the client)
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown);

      // Clean up the event listener when the component is unmounted
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, []);

  // EXPORT IMAGE UNDO REDO END

  function floodFill(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    fillColor: string,
    tolerance: number = 0
  ) {
    const imageData = ctx.getImageData(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    );
    const targetColor = getPixelColor(imageData, x, y);
    const fillColorRGBA = hexToRGBA(fillColor);

    if (colorsMatch(targetColor, fillColorRGBA, tolerance)) {
      return; // Target color is same as fill color, no need to fill
    }

    const pixelsToCheck = [{ x, y }];
    const width = imageData.width;
    const height = imageData.height;

    while (pixelsToCheck.length > 0) {
      const { x, y } = pixelsToCheck.pop()!;

      if (x < 0 || x >= width || y < 0 || y >= height) {
        continue;
      }

      if (colorsMatch(getPixelColor(imageData, x, y), targetColor, tolerance)) {
        setPixelColor(imageData, x, y, fillColorRGBA);
        pixelsToCheck.push(
          { x: x + 1, y },
          { x: x - 1, y },
          { x, y: y + 1 },
          { x, y: y - 1 }
        );
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  function getPixelColor(imageData: ImageData, x: number, y: number): number[] {
    const index = (y * imageData.width + x) * 4;
    return [
      imageData.data[index],
      imageData.data[index + 1],
      imageData.data[index + 2],
      imageData.data[index + 3],
    ];
  }

  function setPixelColor(
    imageData: ImageData,
    x: number,
    y: number,
    color: number[]
  ) {
    const index = (y * imageData.width + x) * 4;
    imageData.data[index] = color[0];
    imageData.data[index + 1] = color[1];
    imageData.data[index + 2] = color[2];
    imageData.data[index + 3] = color[3];
  }

  function colorsMatch(
    color1: number[],
    color2: number[],
    tolerance: number
  ): boolean {
    return (
      Math.abs(color1[0] - color2[0]) <= tolerance &&
      Math.abs(color1[1] - color2[1]) <= tolerance &&
      Math.abs(color1[2] - color2[2]) <= tolerance &&
      Math.abs(color1[3] - color2[3]) <= tolerance
    );
  }

  const drawRectangle = () => {
    if (!shapeStartPoint || !shapeEndPoint) return;

    const ctx = canvasRef.current!.getContext("2d")!;

    // Save the current canvas state
    ctx.save();

    // Use composite operation to draw the rectangle without affecting existing content
    ctx.globalCompositeOperation = "source-over";

    // Draw the new rectangle
    ctx.beginPath();
    ctx.rect(
      shapeStartPoint.x,
      shapeStartPoint.y,
      shapeEndPoint.x - shapeStartPoint.x,
      shapeEndPoint.y - shapeStartPoint.y
    );
    ctx.strokeStyle = shapeStrokeColor; // Use your current brush color
    ctx.lineWidth = shapeStrokeWidth; // Use your current brush width
    ctx.fillStyle = shapeFillColor; // Use your current fill color
    ctx.globalAlpha = shapeFillAlpha; // Use your current fill alpha
    ctx.fill();

    // Use a composite operation to only draw new pixels
    // ctx.globalCompositeOperation = "lighter";
    ctx.stroke();

    // Restore the canvas state
    ctx.restore();
  };

  function hexToRGBA(hex: string): number[] {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b, 255];
  }

  // POINTER DOWN START
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (isFilling) {
      //Paintbucket tool logic
      const ctx = canvasRef.current!.getContext("2d")!;
      const imageData = ctx.getImageData(
        0,
        0,
        canvasRef.current!.width,
        canvasRef.current!.height
      );
      canvasStates.current.push(imageData);

      floodFill(
        ctx,
        Math.floor(x),
        Math.floor(y),
        brushColor,
        fillTolerance * 2.55
      ); // Adjust tolerance as needed
    } else if (isCreatingShape) {
      setShapeStartPoint({ x, y });
      setShapeEndPoint({ x, y });
      const shapeDraw = canvasRef.current!.getContext("2d")!;
      shapeDraw.save();
    } else if (isFreehand) {
      e.preventDefault();
      setIsLassoActive(true);
      setLassoPoints([{ x, y }]);
    } else if (isPencil) {
      e.preventDefault();
      setIsPencilActive(true);
      pencilPoints.current = [
        { x: e.clientX - rect.left, y: e.clientY - rect.top },
      ];

      // setPencilPoints([{ x, y }]);
    } else {
      e.preventDefault();
      setIsDrawing(true);
      const rect = canvasRef.current!.getBoundingClientRect();
      const currentPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setLastPoint(currentPoint);
      // Smudge brush
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
    }
  };
  // POINTER DOWN END

  // POINTER MOVE START
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isCreatingShape && shapeStartPoint) {
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setShapeEndPoint({ x, y });

      // Redraw the canvas with the updated rectangle
      drawRectangle();
    } else if (isFreehand && isLassoActive) {
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setLassoPoints((prevPoints) => [...prevPoints, { x, y }]);

      // Draw the lasso shape as the user moves
      const ctx = canvasRef.current!.getContext("2d")!;
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(lassoPoints[0].x, lassoPoints[0].y);
      lassoPoints.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (isPencil && isPencilActive) {
      //PENCIL TOOL
      const rect = canvasRef.current!.getBoundingClientRect();
      const ctx = canvasRef.current!.getContext("2d")!;

      pencilPoints.current.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });

      let p1 = pencilPoints.current[0];
      let p2 = pencilPoints.current[1];

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineWidth = brushWidth / 3;
      ctx.lineJoin = ctx.lineCap = "round";
      ctx.strokeStyle = brushColor2Rgba;
      ctx.globalAlpha = brushFlow;

      for (let i = 1, len = pencilPoints.current.length; i < len; i++) {
        const midPoint = midPointBtw(p1, p2);
        ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
        p1 = pencilPoints.current[i];
        p2 = pencilPoints.current[i + 1];
        if (p2) {
          ctx.lineTo(p1.x, p1.y);
        }
      }
      ctx.stroke();
      ctx.globalAlpha = brushOpacity;
    } else {
      const spacingRatio = brushSpacing / 10;
      const jitterTangent = brushTangentJitter * 100;
      const jitterNormal = brushNormalJitter * 100;
      const jitterSize = brushSizeJitter * 100;

      if (!isDrawing) return;
      const rect = canvasRef.current!.getBoundingClientRect();
      const currentPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      const dist = distanceBetween(lastPoint!, currentPoint);
      const angle = angleBetween(lastPoint!, currentPoint);
      let pressure = e.pressure;

      if (isNaN(pressure) || pressure < 0 || pressure > 1) {
        console.warn("Invalid pressure value detected:", pressure, "Event:", e);
        pressure = 0.5;
      }

      pressure = Math.max(0.001, Math.min(pressure, 1));
      const randomSize = Math.random() * jitterSize - jitterSize / 2;

      const brushSize =
        brushWidth * (pressureSize ? pressure : 0.5) + randomSize;
      const stampSpacing = brushWidth * spacingRatio;

      const ctx = canvasRef.current!.getContext("2d")!;
      ctx.lineJoin = ctx.lineCap = "round";
      ctx.globalAlpha = (pressureOpacity ? pressure : 1) * 2 * brushFlow;
      console.log(brushWidth);
      console.log(ctx.globalAlpha);
      console.log(pressureOpacity);
      console.log(pressureSize);

      if (isErasing) {
        ctx.globalCompositeOperation = "destination-out";
        console.log(
          "DrawingCanvas.tsx: handlePointerMove: isErasing: " + isErasing
        );
      } else {
        ctx.globalCompositeOperation = "source-over";
      }

      if (isSmudging) {
        const prevPoint = lastPoint!;
        const dist = distanceBetween(prevPoint, currentPoint);
        const angle = angleBetween(prevPoint, currentPoint);

        const radius = brushSize / 2;
        if (brushCanvas) {
          brushCanvas.width = brushSize;
          brushCanvas.height = brushSize;
        }

        brushCtx?.clearRect(0, 0, brushSize, brushSize);
        if (brushCtx) {
          brushCtx.globalCompositeOperation = "source-over";
        }

        let tempCanvas;

        if (typeof window !== "undefined") {
          tempCanvas = document.createElement("canvas");
        }

        if (tempCanvas) {
          let tempCtx = tempCanvas.getContext("2d", {
            willReadFrequently: true,
          });

          if (tempCtx !== null && copy !== null) {
            tempCanvas.width = copy.width;
            tempCanvas.height = copy.height;
            tempCtx.putImageData(copy, 0, 0);
            tempCtx.globalAlpha = pressure * brushFlow;
            brushCtx?.drawImage(tempCanvas, 0, 0);
          }
        }

        if (brushCtx) {
          brushCtx.globalCompositeOperation = "destination-in";
          brushCtx.fillStyle = createFeatherGradient(radius, brushSoftness);
          brushCtx.fillRect(0, 0, brushSize, brushSize);
        }

        const stepSize = 3;

        for (let i = 0; i < dist; i += stepSize) {
          const x = prevPoint.x + Math.sin(angle) * i;
          const y = prevPoint.y + Math.cos(angle) * i;

          ctx.globalCompositeOperation = "source-over";
          if (brushCanvas) {
            ctx.drawImage(brushCanvas, x - radius, y - radius);
          }

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
          const randomTangent =
            Math.random() * jitterTangent - jitterTangent / 2;
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

          let brushAngle = Math.atan2(
            currentPoint.y - lastPoint!.y,
            currentPoint.x - lastPoint!.x
          );

          brushAngle = brushAngle + brushRotation;

          Math.random() * brushRotationJitter - brushRotationJitter / 2;
          brushAngle +=
            (Math.random() * (brushRotationJitter - brushRotationJitter / 2)) /
            20;
          createScalableRadialGradient(
            ctx,
            x,
            y,
            brushSize,
            brushSoftness,
            brushShape, // scaleX
            1, // scaleY (this will make the brush half as tall as it is wide)
            brushAngle, // Use the angle between points as rotation
            brushColor1Rgba,
            brushColor2Rgba,
            brushColor3Rgba
          );

          // Debug: Log the coordinates and angle
          console.log(`Stamp at (${x}, ${y}), angle: ${angle}`);
        }
      }

      setLastPoint(currentPoint);
    }
  };
  // POINTER MOVE END

  // POINTER UP START
  const handlePointerUp = () => {
    if (isCreatingShape) {
      // Finalize the rectangle
      drawRectangle();
      setShapeStartPoint(null);
      setShapeEndPoint(null);
      //   setCreatingShape(false);
    } else if (isFreehand && isLassoActive) {
      setIsLassoActive(false);
      const ctx = canvasRef.current!.getContext("2d")!;
      ctx.fillStyle = brushColor;
      ctx.beginPath();
      ctx.moveTo(lassoPoints[0].x, lassoPoints[0].y);
      lassoPoints.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      setLassoPoints([]);
    } else if (isPencil && isPencilActive) {
      setIsPencilActive(false);
      const ctx = canvasRef.current!.getContext("2d")!;
      pencilPoints.current = [];
      ctx.closePath();
      ctx.globalAlpha = brushFlow;
      pencilPoints.current = [];
    } else {
      setIsDrawing(false);
    }
  };
  // POINTER UP END
  //Custom Cursor
  const diameter = brushWidth / 3;
  console.log("DrawingCanvas.tsx: diameter: ", brushWidth * 2);

  const cursor = circleCursor(diameter);

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      style={{ cursor: cursor, touchAction: "none" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    />
  );
};

export default Canvas;
