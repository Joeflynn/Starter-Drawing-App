// utils/colorUtils.ts
//Used for working with HSB in React Aria Color Field/ParseColor

const hexToRgb = (hex: string) => {
    hex = hex.replace('#', ''); // remove # if present
    const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };
  
  
  const rgbToHsv = ({ r, g, b }: { r: number; g: number; b: number }) => {
    r /= 255;
    g /= 255;
    b /= 255;
  
    let max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      v = max;
  
    let d = max - min;
    s = max == 0 ? 0 : d / max;
  
    if (max == min) {
      h = 0; // achromatic
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
  
    return { h: h * 360, s: s * 100, v: v * 100 };
  };
  
  const hexToHsv = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (rgb === null) return null;
    return rgbToHsv(rgb);
  };
  
  export default hexToHsv;
  