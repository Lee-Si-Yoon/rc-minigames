import { isDifferenceLessThan } from "../../../utils/math";

interface ParticleProps {
  position: { x: number; y: number };
  context: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;
  size: number;
}

class Particle {
  private context: CanvasRenderingContext2D;
  private canvasWidth: number = 0;
  private canvasHeight: number = 0;

  private originalPosition: { x: number; y: number } = { x: 0, y: 0 };
  position: { x: number; y: number } = { x: 0, y: 0 };
  private deltaPostion: { x: number; y: number } = { x: 0, y: 0 };
  private size: number = 0;
  private force: number = 0;
  private angle: number = 0;
  private distance: number = 0;
  private friction: number = Math.random() * 0.6 + 0.15;
  private ease: number = Math.random() * 0.1 + 0.05;

  private isPositionBackToOrigin: boolean = false;

  constructor({
    context,
    canvasHeight,
    canvasWidth,
    position,
    size,
  }: ParticleProps) {
    this.context = context;
    this.originalPosition = position;
    this.position = {
      x: Math.random() * canvasWidth,
      y: canvasHeight - canvasHeight,
    };
    this.size = size;
  }

  getIfPositionIsBackToOrigin(): boolean {
    return this.isPositionBackToOrigin;
  }

  getPositions() {
    return {
      position: this.position,
      originalPosition: this.originalPosition,
    };
  }

  draw() {
    this.context.fillRect(
      this.position.x,
      this.position.y,
      this.size,
      this.size
    );
  }

  update() {
    if (!this.isPositionBackToOrigin) {
      this.position.x +=
        (this.originalPosition.x - this.position.x) * this.ease;
      this.position.y +=
        (this.originalPosition.y - this.position.y) * this.ease;
    } else if (
      isDifferenceLessThan(this.position.x, this.originalPosition.x, 0.5) &&
      isDifferenceLessThan(this.position.y, this.originalPosition.y, 0.5)
    ) {
      this.isPositionBackToOrigin = true;
    }
  }
}

export default Particle;
