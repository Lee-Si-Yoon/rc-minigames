import { isDifferenceLessThan } from "../../../utils/math";
import Effect from "./effect";

interface ParticleProps {
  effect: Effect;
  position: { x: number; y: number };
}

class Particle {
  private effect: Effect;

  private originalPosition: { x: number; y: number } = { x: 0, y: 0 };
  private position: { x: number; y: number } = { x: 0, y: 0 };
  private deltaPostion: { x: number; y: number } = { x: 0, y: 0 };
  private size: number = 0;
  private force: number = 0;
  private angle: number = 0;
  private distance: number = 0;
  private friction: number = Math.random() * 0.6 + 0.15;
  private ease: number = Math.random() * 0.1 + 0.05;

  private isPositionBackToOrigin: boolean = false;

  constructor({ effect, position }: ParticleProps) {
    this.effect = effect;
    this.originalPosition = position;
    this.position = {
      x: Math.random() * this.effect.canvasWidth,
      y: 0,
    };
    this.size = this.effect.gap;
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
    this.effect.context.fillRect(
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
    }
    if (
      isDifferenceLessThan(this.position.x, this.originalPosition.x, 0.5) &&
      isDifferenceLessThan(this.position.y, this.originalPosition.y, 0.5)
    ) {
      this.isPositionBackToOrigin = true;
    }
  }
}

export default Particle;
