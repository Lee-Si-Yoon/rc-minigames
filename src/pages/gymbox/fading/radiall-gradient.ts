import BaseLayer from "../../../utils/base-layer";
import { Coord, RGB } from "../../../utils/types";

interface CanvasLayerConstructor {
  canvas: HTMLCanvasElement;
}

const COLORS: RGB[] = [
  { r: 132, g: 6, b: 169 },
  { r: 244, g: 16, b: 10 },
  { r: 201, g: 5, b: 0 },
  // { r: 64, g: 64, b: 68 },
];

interface GlowParticleProps {
  position: Coord;
  radius: number;
  rgb: RGB;
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
}

class GlowParticle {
  private width: number = 0;
  private height: number = 0;
  private ctx: CanvasRenderingContext2D;
  private position: Coord = { x: 0, y: 0 };
  private radius: number = 0;
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
  }: GlowParticleProps) {
    this.position = position;
    this.radius = radius;
    this.rgb = rgb;
    this.width = width;
    this.height = height;
    this.ctx = ctx;
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
      this.radius * 0.01,
      this.position.x,
      this.position.y,
      this.radius
    );
    g.addColorStop(0, `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, 1)`);
    g.addColorStop(1, `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, 0)`);
    ctx.fillStyle = g;
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2,
      false
    );
    ctx.fill();
  }
}

class RadiallGradient extends BaseLayer {
  private totalParticles = 6;
  private particles: GlowParticle[] = [];
  private maxRadius = 900;
  private minRadius = 400;

  private fps: number = 60;
  private interval: number = 1000 / this.fps;
  private timeStamp: number = 0;

  constructor({ canvas }: CanvasLayerConstructor) {
    super({ canvas });
    this.ctx = canvas.getContext("2d")!;
    this.element = canvas;
  }

  createParticles(): void {
    let currColor = 0;
    this.particles = [];

    for (let i = 0; i < this.totalParticles; i++) {
      const item = new GlowParticle({
        ctx: this.ctx,
        width: this.width,
        height: this.height,
        position: {
          x: Math.random() * this.width,
          y: Math.random() * this.height,
        },
        radius:
          Math.random() * (this.maxRadius - this.minRadius) + this.minRadius,
        rgb: COLORS[currColor],
      });

      if (++currColor >= COLORS.length) {
        currColor = 0;
      }

      this.particles[i] = item;
    }
  }

  playFrames(): void {
    let timer = 0;
    let lastTime = 0;
    const animate = (timeStamp: number) => {
      this.timeStamp = timeStamp;
      const deltaTime = timeStamp - lastTime;
      lastTime = timeStamp;

      if (timer > this.interval) {
        timer = 0;
        this.render();
      }

      requestAnimationFrame(animate);

      if (this.timeStamp === 0) {
        this.createParticles();
      }

      timer += deltaTime;
    };
    animate(this.timeStamp);
  }

  render(): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.globalCompositeOperation = "saturation";

    for (let i = 0; i < this.totalParticles; i++) {
      const item = this.particles[i];
      if (item) {
        item.update();
        item.render();
      }
    }
  }
}

export default RadiallGradient;
