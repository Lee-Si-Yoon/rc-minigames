interface Position {
  x: number;
  y: number;
}

interface TextProps {
  data: string;
  ctx: CanvasRenderingContext2D;
}

class Text {
  protected ctx: CanvasRenderingContext2D;

  private data: string = "";
  private position: Position = { x: 0, y: 0 };
  private velocity: Position = { x: 0, y: 0 };
  private dimension: { width: number; height: number } = {
    width: 0,
    height: 0,
  };

  constructor({ data, ctx }: TextProps) {
    this.ctx = ctx;
    this.data = data;
    this.dimension.width = this.getTextMetrics().width;
    this.dimension.height =
      this.getTextMetrics().actualBoundingBoxAscent +
      this.getTextMetrics().actualBoundingBoxDescent;
  }

  getPosition(): Position {
    return this.position;
  }

  getDimension(): { width: number; height: number } {
    return this.dimension;
  }

  getVelocity(): Position {
    return this.velocity;
  }

  getTextData(): string {
    return this.data;
  }

  getTextMetrics(): TextMetrics {
    return this.ctx.measureText(this.data);
  }

  setPosition(position: Position): void {
    this.position = position;
  }

  setVelocity(velocity: Position): void {
    this.velocity = velocity;
  }

  updatePositionByVelocity(): void {
    if (this.velocity.x === 0 && this.velocity.y === 0) return;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  render(position: Position) {
    this.ctx.fillText(this.data, position.x, position.y);
  }
}

export default Text;
