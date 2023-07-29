import { CSSProperties } from "react";
import Effect from "./effect";

interface ParticleProps {
  effect: Effect;
  position: { x: number; y: number };
  color: CSSProperties["color"];
}

class Particle {
  effect: Effect | null = null;

  private color: CSSProperties["color"] = "none";

  originalPosition: { x: number; y: number } = { x: 0, y: 0 };
  position: { x: number; y: number } = { x: 0, y: 0 };
  deltaPostion: { x: number; y: number } = { x: 0, y: 0 };
  vPosition: { x: number; y: number } = { x: 0, y: 0 };
  size: number = 0;
  force: number = 0;
  angle: number = 0;
  distance: number = 0;
  friction: number = Math.random() * 0.6 + 0.15;
  ease: number = Math.random() * 0.1 + 0.005;

  constructor({ effect, position, color }: ParticleProps) {
    this.effect = effect;
    this.color = color;
    this.position = {
      x: Math.random() * effect.canvasWidth,
      y: effect.canvasHeight,
    };
    this.originalPosition = position;
    this.size = effect.gap - 1;
  }

  draw() {
    if (!this.effect) return;
    if (this.color) this.effect.context.fillStyle = this.color;

    this.effect.context.fillRect(
      this.position.x,
      this.position.y,
      this.size,
      this.size
    );
  }

  update() {
    this.position.x += (this.originalPosition.x - this.position.x) * this.ease;
    this.position.y += (this.originalPosition.y - this.position.y) * this.ease;
  }
}

export default Particle;
