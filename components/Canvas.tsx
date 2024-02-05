"use client";

import React, { useRef, useEffect } from "react";

interface CanvasProps {
  width: number;
  height: number;
  brushColor?: string;
  brushSize?: number;
  backgroundColor?: string;
  brushOpacity?: number;
  brushSoftness?: number;
  activeTool?: string;
}

const Canvas: React.FC<CanvasProps> = ({ ...CanvasProps }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (context) {
      // Set canvas size
      canvas.width = CanvasProps.width;
      canvas.height = CanvasProps.height;

      // Add event listeners for drawing
      canvas.addEventListener("mousedown", startDrawing);
      canvas.addEventListener("mousemove", draw);
      canvas.addEventListener("mouseup", stopDrawing);
      canvas.addEventListener("mouseleave", stopDrawing);
    }

    return () => {
      // Clean up event listeners
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
    };
  }, [CanvasProps.width, CanvasProps.height]);

  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  const startDrawing = (event: MouseEvent) => {
    isDrawing = true;
    lastX = event.clientX;
    lastY = event.clientY;
  };

  const draw = (event: MouseEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (context) {
      context.beginPath();
      context.moveTo(lastX, lastY);
      context.lineTo(event.clientX, event.clientY);
      context.stroke();

      lastX = event.clientX;
      lastY = event.clientY;
    }
  };

  const stopDrawing = () => {
    isDrawing = false;
  };

  return (
    <canvas
      ref={canvasRef}
      style={{ touchAction: "none", background: CanvasProps.backgroundColor }}
    />
  );
};

export default Canvas;
