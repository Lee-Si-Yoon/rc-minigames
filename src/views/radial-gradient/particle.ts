import { Coord, RGB } from "../../utils/types";

interface GlowParticleProps {
  position: Coord;
  radius: number;
  rgb: RGB;
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  velocity: Coord;
}

class GlowParticle {
  private width: number = 0;
  private height: number = 0;
  private ctx: CanvasRenderingContext2D;
  private position: Coord = { x: 0, y: 0 };
  private radius: number = 1;
  private rgb: RGB = { r: 0, g: 0, b: 0 };
  private velocity: Coord = { x: Math.random() * 4, y: Math.random() * 4 };
  private sinValue = Math.random();

  constructor({
    position,
    radius,
    rgb,
    width,
    height,
    ctx,
    velocity,
  }: GlowParticleProps) {
    this.position = position;
    this.radius = radius;
    this.rgb = rgb;
    this.width = width;
    this.height = height;
    this.ctx = ctx;
    this.velocity = velocity;
  }

  update(): void {
    this.sinValue += 0.01;

    this.radius += Math.sin(this.sinValue);

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.x < 0) {
      this.velocity.x *= -1;
      this.position.x += 10;
    } else if (this.position.x > this.width) {
      this.velocity.x *= -1;
      this.position.x -= 10;
    }
    if (this.position.y < 0) {
      this.velocity.y *= -1;
      this.position.y += 10;
    } else if (this.position.y > this.height) {
      this.velocity.y *= -1;
      this.position.y -= 10;
    }
  }

  render(): void {
    const ctx = this.ctx;
    ctx.beginPath();
    const g = ctx.createRadialGradient(
      this.position.x,
      this.position.y,
      this.radius * 0.01 <= 0 ? 0.1 : this.radius * 0.01,
      this.position.x,
      this.position.y,
      this.radius <= 0 ? 0.1 : this.radius
    );
    g.addColorStop(0, `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, 1)`);
    g.addColorStop(1, `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, 0)`);
    ctx.fillStyle = g;
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius <= 0 ? 0 : this.radius,
      0,
      Math.PI * 2,
      false
    );
    ctx.fill();
  }
}

export { GlowParticleProps };
export default GlowParticle;
