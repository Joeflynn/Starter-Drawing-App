// ShapeDraw.ts

export class ShapeDraw {
    private ctx: CanvasRenderingContext2D;
  
    constructor(ctx: CanvasRenderingContext2D) {
      this.ctx = ctx;
    }
  
    public drawRect(
      x: number,
      y: number,
      width: number,
      height: number,
      fillColor: string,
      strokeColor: string,
      strokeWidth: number,
      strokeAlpha: number,
      fillAlpha: number
    ): void {
      this.ctx.beginPath();
      this.ctx.rect(x, y, width, height);
      this.applyFillAndStroke(fillColor, strokeColor, strokeWidth, strokeAlpha, fillAlpha);
    }
  
    public drawStar(
        x: number,
        y: number,
        pointCount: number,
        innerRadius: number,
        outerRadius: number,
        fillColor: string,
        strokeColor: string,
        strokeWidth: number,
        strokeAlpha: number,
        fillAlpha: number
      ): void {
        this.ctx.beginPath();
        for (let i = 0; i < pointCount * 2; i++) {
          const angle = (i * Math.PI) / pointCount;
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const xPos = x + Math.cos(angle) * radius;
          const yPos = y + Math.sin(angle) * radius;
          if (i === 0) {
            this.ctx.moveTo(xPos, yPos);
          } else {
            this.ctx.lineTo(xPos, yPos);
          }
        }
        this.ctx.closePath();
        this.applyFillAndStroke(fillColor, strokeColor, strokeWidth, strokeAlpha, fillAlpha);
      }
  
    public drawRoundedRect(
      x: number,
      y: number,
      width: number,
      height: number,
      radius: number,
      fillColor: string,
      strokeColor: string,
      strokeWidth: number,
      strokeAlpha: number,
      fillAlpha: number
    ): void {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y + radius);
      this.ctx.arcTo(x, y + height, x + radius, y + height, radius);
      this.ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
      this.ctx.arcTo(x + width, y, x + width - radius, y, radius);
      this.ctx.arcTo(x, y, x, y + radius, radius);
      this.ctx.closePath();
      this.applyFillAndStroke(fillColor, strokeColor, strokeWidth, strokeAlpha, fillAlpha);
    }
  
    public drawEllipse(
      x: number,
      y: number,
      width: number,
      height: number,
      fillColor: string,
      strokeColor: string,
      strokeWidth: number,
      strokeAlpha: number,
      fillAlpha: number
    ): void {
      this.ctx.beginPath();
      this.ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI);
      this.applyFillAndStroke(fillColor, strokeColor, strokeWidth, strokeAlpha, fillAlpha);
    }
  
    public drawRegularPolygon(
      x: number,
      y: number,
      sides: number,
      radius: number,
      fillColor: string,
      strokeColor: string,
      strokeWidth: number,
      strokeAlpha: number,
      fillAlpha: number
    ): void {
      this.ctx.beginPath();
      this.ctx.moveTo(x + radius, y);
      for (let i = 1; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides;
        const xPos = x + Math.cos(angle) * radius;
        const yPos = y + Math.sin(angle) * radius;
        this.ctx.lineTo(xPos, yPos);
      }
      this.ctx.closePath();
      this.applyFillAndStroke(fillColor, strokeColor, strokeWidth, strokeAlpha, fillAlpha);
    }
  
    private applyFillAndStroke(
      fillColor: string,
      strokeColor: string,
      strokeWidth: number,
      strokeAlpha: number,
      fillAlpha: number
    ): void {
      this.ctx.fillStyle = this.hexToRGBA(fillColor, fillAlpha);
      this.ctx.fill();
      this.ctx.lineWidth = strokeWidth;
      this.ctx.strokeStyle = this.hexToRGBA(strokeColor, strokeAlpha);
      this.ctx.stroke();
    }
  
    private hexToRGBA(hex: string, alpha: number): string {
      const r = parseInt(hex.slice(2, 4), 16);
      const g = parseInt(hex.slice(4, 6), 16);
      const b = parseInt(hex.slice(6, 8), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  }