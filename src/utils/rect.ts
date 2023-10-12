import type { Coord } from './types';

interface RectProps {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  x: number;
  y: number;
  degree: number;
  isDebugMode?: boolean;
}

abstract class Rect {
  protected isDebugMode: boolean = false;

  protected ctx: CanvasRenderingContext2D;

  protected width: number = 0;

  protected height: number = 0;

  protected x: number = 0;

  protected y: number = 0;

  protected degree: number = 0;

  // in clockwise
  protected vertex: Coord[] = [];

  protected edge: Coord[] = [];

  constructor({ ctx, x, y, degree, width, height, isDebugMode }: RectProps) {
    this.isDebugMode = isDebugMode || false;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.degree = degree;

    this.vertex.push({ x: this.x, y: this.y }); // leftTop
    this.vertex.push({ x: this.x + this.width, y: this.y }); // rightTop
    this.vertex.push({ x: this.x + this.width, y: this.y + this.height }); // rightBottom
    this.vertex.push({ x: this.x, y: this.y + this.height }); // leftBottom

    this.updateEdge();
  }

  get context() {
    return this.ctx;
  }

  get dimension() {
    return { width: this.width, height: this.height };
  }

  get edges() {
    return this.edge;
  }

  get vertexs() {
    return this.vertex;
  }

  rectCollision(collidedRect: Rect): boolean {
    const collided =
      this.x < collidedRect.x + collidedRect.width &&
      this.x + this.width > collidedRect.x &&
      this.y < collidedRect.y + collidedRect.height &&
      this.y + this.height > collidedRect.y;

    return collided;
  }

  updateEdge(): void {
    for (let i = 0; i < this.vertex.length; i++) {
      // e.g. i = 0 -> i = leftTop, nextNumber = rightTop
      const nextNumber = (i + 1) % this.vertex.length;

      const edgeX = this.vertex[nextNumber].x - this.vertex[i].x;
      const edgeY = this.vertex[nextNumber].y - this.vertex[i].y;

      this.edge.push({ x: edgeX, y: edgeY });
    }
  }

  updateVertex(): void {
    const radian = (Math.PI / 180) * this.degree;
    const sin = Math.sin(radian);
    const cos = Math.cos(radian);
    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;

    // 그리고, 각 꼭짓점에 따른 회전한 좌표 계산
    // 공식: x = (x좌표 * cos radian) - (y좌표 * sin radian) + (사각형의 x좌표 + 절반길이)
    // 공식: y = (x좌표 * sin radian) + (y좌표 * cos radian) + (사각형의 y좌표 + 절반높이)
    // 이것은, canvas 에서 회전기능을 사용했을 때, 캔버스의 원점을 사각형의 중심점으로 이동한 후
    // 출력 위치가 (-halfWidth, -halfHeight) 이기 때문에, 이런 공식을 사용합니다.
    // 회전한 점의 위치를 사각형의 실제 위치로 바꾸기 위해
    // 사각형의 원래 위치 + (x축은 절반길이, y축은 절반높이) 만큼 더합니다.
    this.vertex[0].x = Math.round(
      -halfWidth * cos - -halfHeight * sin + (this.x + halfWidth)
    );
    this.vertex[0].y = Math.round(
      -halfWidth * sin + -halfHeight * cos + (this.y + halfHeight)
    );
    this.vertex[1].x = Math.round(
      halfWidth * cos - -halfHeight * sin + (this.x + halfWidth)
    );
    this.vertex[1].y = Math.round(
      halfWidth * sin + -halfHeight * cos + (this.y + halfHeight)
    );
    this.vertex[2].x = Math.round(
      halfWidth * cos - halfHeight * sin + (this.x + halfWidth)
    );
    this.vertex[2].y = Math.round(
      halfWidth * sin + halfHeight * cos + (this.y + halfHeight)
    );
    this.vertex[3].x = Math.round(
      -halfWidth * cos - halfHeight * sin + (this.x + halfWidth)
    );
    this.vertex[3].y = Math.round(
      -halfWidth * sin + halfHeight * cos + (this.y + halfHeight)
    );

    this.updateEdge();
  }

  showAABBLine() {
    const { ctx } = this;

    const minX = Math.min(
      this.vertex[0].x,
      this.vertex[1].x,
      this.vertex[2].x,
      this.vertex[3].x
    );
    const minY = Math.min(
      this.vertex[0].y,
      this.vertex[1].y,
      this.vertex[2].y,
      this.vertex[3].y
    );
    const maxX = Math.max(
      this.vertex[0].x,
      this.vertex[1].x,
      this.vertex[2].x,
      this.vertex[3].x
    );
    const maxY = Math.max(
      this.vertex[0].y,
      this.vertex[1].y,
      this.vertex[2].y,
      this.vertex[3].y
    );

    ctx.strokeStyle = 'purple';
    ctx.beginPath();
    ctx.moveTo(minX, minY);
    ctx.lineTo(maxX, minY);
    ctx.lineTo(maxX, maxY);
    ctx.lineTo(minX, maxY);
    ctx.lineTo(minX, minY);
    ctx.stroke();
    ctx.closePath();
  }

  testRender() {
    const { ctx } = this;

    if (this.degree === 0) {
      ctx.fillRect(this.x, this.y, this.width, this.height);
    } else {
      ctx.save();

      const centerX = this.x + this.width / 2;
      const centerY = this.y + this.height / 2;
      ctx.translate(centerX, centerY);

      const radian = (Math.PI / 180) * this.degree;
      ctx.rotate(radian);

      const halfWidth = this.width / 2;
      const halfHeight = this.height / 2;
      ctx.fillRect(-halfWidth, -halfHeight, this.width, this.height);

      ctx.restore();
    }
  }

  abstract render(): void;
}

export default Rect;
