import React, { useRef, forwardRef, ReactElement } from "react";

interface ZoomContainerProps {
  children: ReactElement;
}

const ZoomContainer = forwardRef(
  ({ children }: ZoomContainerProps, canvasRef) => {
    const containerRef = useRef(null);
    const zoomLevel = 0.5; // Adjust this value based on user interactions

    return (
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          transformOrigin: "top left",
          transform: `scale(${zoomLevel})`,
        }}
      >
        {React.cloneElement(children, { ref: canvasRef })}
      </div>
    );
  }
);

export default ZoomContainer;
