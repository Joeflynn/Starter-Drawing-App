export function circleSVG(diameter: number) {
  const radius = diameter / 2;
  const crosshairLength = diameter * 0.3; // Adjust this value to change the size of the crosshair
  const crosshairStart = (diameter - crosshairLength) / 2;
  const crosshairEnd = crosshairStart + crosshairLength;

  const strokeWidth = 2;
  const effectiveRadius = radius - strokeWidth / 2;

  return `<svg xmlns='http://www.w3.org/2000/svg' width='${diameter}' height='${diameter}' viewBox='0 0 ${diameter} ${diameter}'>
    <circle r='${effectiveRadius}' cy='${radius}' cx='${radius}' stroke-width='${strokeWidth}'  stroke='rgba(0,0,0,0.5)' fill='none'/>
    <line x1='${radius}' y1='${crosshairStart}' x2='${radius}' y2='${crosshairEnd}' style='stroke:rgba(0,0,0,0.5);stroke-width:2' />
    <line x1='${crosshairStart}' y1='${radius}' x2='${crosshairEnd}' y2='${radius}' style='stroke:rgba(0,0,0,0.5);stroke-width:2' />
</svg>`;
}

export function circleDataUri(diameter: number) {
  return `data:image/svg+xml;base64,${btoa(circleSVG(diameter))}`;
}

export function circleCursor(diameter: number) {
  return `url(${circleDataUri(diameter)}) ${diameter / 2} ${
    diameter / 2
  }, crosshair`;
}
