import BaseLayer from "../../utils/base-layer";
import { Coord, RGB } from "../../utils/types";
import { tintColorRGB, greyColorRGB } from "../../utils/colors";
import GlowParticle from "./particle";

interface ControllerProps {
  canvas: HTMLCanvasElement;
  colors?: RGB[];
  particleRadius?: { min: number; max: number };
  totalParticles?: number;
  fps?: number;
  velocity?: Coord;
}

class Controller extends BaseLayer {
  private colors: RGB[] = [
    tintColorRGB.red_01,
    tintColorRGB.red_02,
    tintColorRGB.red_03,
    tintColorRGB.red_04,
    tintColorRGB.red_05,
    greyColorRGB.grey_04,
    greyColorRGB.black,
    greyColorRGB.black,
  ];

  private totalParticles = 6;
  private particles: GlowParticle[] = [];
  private maxRadius = 900;
  private minRadius = 400;

  private fps: number = 60;
  private interval: number = 1000 / this.fps;
  private timeStamp: number = 0;

  private velocity: Coord = { x: Math.random() * 4, y: Math.random() * 4 };

  constructor({
    canvas,
    colors,
    particleRadius,
    totalParticles,
    fps,
    velocity,
  }: ControllerProps) {
    super({ canvas });
    this.ctx = canvas.getContext("2d")!;
    this.element = canvas;

    if (colors) this.colors = colors;
    if (particleRadius) {
      this.maxRadius = particleRadius.max;
      this.minRadius = particleRadius.min;
    }
    if (totalParticles) this.totalParticles = totalParticles;
    if (fps) this.fps = fps;
    if (velocity) this.velocity = velocity;
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
        rgb: this.colors[currColor],
        velocity: this.velocity,
      });

      if (++currColor >= this.colors.length) {
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

export default Controller;
