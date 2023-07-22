interface Position {
  x: number;
  y: number;
}

interface TextProps {
  data: string;
  ctx: CanvasRenderingContext2D;
  position?: Position;
}

class Text {
  protected ctx: CanvasRenderingContext2D;

  private data: string = "";
  private position: Position = { x: 0, y: 0 };
  private nextPosition: Position = { x: 0, y: 0 };
  private velocity: Position = { x: 0, y: 0 };
  private dimension: { width: number; height: number } = {
    width: 0,
    height: 0,
  };
  private mass: number = 1;
  private corFactor: number = 1.2;

  constructor({ data, ctx, position }: TextProps) {
    this.ctx = ctx;
    this.data = data;
    if (position) {
      this.position = position;
    }

    const getTextMetrics = (
      ctx: CanvasRenderingContext2D,
      data: string
    ): TextMetrics => ctx.measureText(data);

    this.dimension.width = getTextMetrics(ctx, data).width;
    this.dimension.height =
      getTextMetrics(ctx, data).actualBoundingBoxAscent +
      getTextMetrics(ctx, data).actualBoundingBoxDescent;
  }

  getPosition(): Position {
    return this.position;
  }

  getDimension(): { width: number; height: number } {
    return this.dimension;
  }

  getVelocityAfterCollision(collidedText: Text): Position {
    const velocity = {
      x:
        ((this.mass - collidedText.mass * this.corFactor) /
          (this.mass + collidedText.mass)) *
          this.velocity.x +
        ((collidedText.mass + collidedText.mass * this.corFactor) /
          (this.mass + collidedText.mass)) *
          collidedText.velocity.x,
      y:
        ((this.mass - collidedText.mass * this.corFactor) /
          (this.mass + collidedText.mass)) *
          this.velocity.y +
        ((collidedText.mass + collidedText.mass * this.corFactor) /
          (this.mass + collidedText.mass)) *
          collidedText.velocity.y,
    };
    return velocity;
  }

  getIsCollided(collidedText: Text): boolean {
    const distanceUnits = Math.sqrt(
      Math.pow(Math.abs(this.position.x - collidedText.position.x), 2) +
        Math.pow(Math.abs(this.position.y - collidedText.position.y), 2)
    );
    /**
     * @url https://github.com/DongChyeon/JS-Toy-Projects/blob/master/AirHockey/game.js#L22C28-L22C28
     * @url https://velog.io/@dongchyeon/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%A1%9C-%EC%97%90%EC%96%B4-%ED%95%98%ED%82%A4-%EA%B2%8C%EC%9E%84%EC%9D%84-%EB%A7%8C%EB%93%A4%EC%96%B4%EB%B3%B4%EC%9E%90
     * FIXME get correct radius
     */
    const sumRadius = this.dimension.width + this.dimension.width;

    return distanceUnits < sumRadius;
  }

  getTextData(): string {
    return this.data;
  }

  setPosition(position: Position): void {
    this.position = position;
  }

  setVelocity(velocity: Position): void {
    this.velocity = velocity;
  }

  updatePositionByVelocity(): void {
    if (this.velocity.x === 0 && this.velocity.y === 0) return;
    this.nextPosition.x = this.position.x + this.velocity.x;
    this.nextPosition.y = this.position.y + this.velocity.y;

    // TODO fill up if

    this.position.x = this.nextPosition.x;
    this.position.y = this.nextPosition.y;
  }

  render(position: Position): void {
    this.ctx.fillText(this.data, position.x, position.y);
  }
}

export default Text;
