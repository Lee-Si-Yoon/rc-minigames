import { getRandomArbitrary } from "../../../utils/math";
import { divideKOR, isKOR } from "../../../utils/parse-korean";
import { Coord } from "../../../utils/types";
import RigidBody from "./rigid-body";
import LifeCycleState, { LifeCycle } from "./text-state";

export interface TextProps {
  data: string;
  ctx: CanvasRenderingContext2D;
  id?: number;
  position?: Coord;
  velocity?: Coord;
  mass?: number;
  special?: number;
}

export enum TextState {
  INIT = "init",
  PARTICLED = "particled",
  DEAD = "dead",
}

class Text extends RigidBody {
  protected ctx: CanvasRenderingContext2D;

  private data: string = "";
  private score: number = 0;
  private state: TextState = TextState.INIT;
  private special: number = 1;

  public particles: Text[] = [];
  public particleLifeTime: number = 100;

  public LifeCycle: LifeCycleState;

  constructor({ data, ctx }: TextProps) {
    super();

    this.ctx = ctx;
    this.data = data;

    this.LifeCycle = new LifeCycleState({ Text: this });

    const getTextMetrics = (
      ctx: CanvasRenderingContext2D,
      data: string
    ): TextMetrics => ctx.measureText(data);

    this.dimension.width = getTextMetrics(ctx, data).width * 1;
    this.dimension.height =
      (getTextMetrics(ctx, data).actualBoundingBoxAscent +
        getTextMetrics(ctx, data).actualBoundingBoxDescent) *
      1;

    if (isKOR(data)) {
      const splitedKOR = divideKOR(data);
      this.score = splitedKOR.length * this.special;
    } else {
      this.score = data.length * this.special;
    }
  }

  getSpecial(): number {
    return this.special;
  }

  getScore(): number {
    return this.score;
  }

  textData(): string {
    return this.data;
  }

  setIsAlive(state: TextState) {
    this.state = state;
  }

  splitToParticle() {
    if (this.state !== TextState.PARTICLED) return;

    this.data.split("").forEach((d) => {
      this.particles.push(
        new Text({
          data: d,
          ctx: this.ctx,
          velocity: this.velocity,
        })
      );
    });

    this.particles.forEach((particle, index) => {
      const { width } = particle.getDimension();
      const { x: veloX, y: veloY } = particle.getVelocity();
      particle.setPosition({
        x: this.position.x + (index + 1) * width,
        y: this.position.y,
      });
      particle.setVelocity({
        x: getRandomArbitrary(-veloX * 2 || -2, veloX * 2 || 2),
        y: getRandomArbitrary(veloY * 1, veloY * 2),
      });
    });
  }

  update(): void {
    if (this.state === TextState.INIT) {
      this.position.x += this.velocity.x + this.collideVelocity.x;
      this.position.y += this.velocity.y + this.collideVelocity.y;

      if (this.collideVelocity.x > 0.1) this.collideVelocity.x *= 0.6;
      if (this.collideVelocity.y > 0.1) this.collideVelocity.y *= 0.6;
    }

    if (this.state === TextState.PARTICLED) {
      this.splitToParticle();

      // after text is particled it is set as state=dead
      this.state = TextState.DEAD;
    }

    if (this.particles.length > 0 && this.state === TextState.DEAD) {
      this.particles.forEach((particle) => {
        const { x: posX, y: posY } = particle.getPosition();
        const { x: veloX, y: veloY } = particle.getVelocity();
        particle.setPosition({
          x: posX + veloX,
          y: posY + veloY,
        });
      });
      if (this.particleLifeTime <= 0) {
        this.particles = [];
      }
    }
  }

  render(): void {
    if (this.state !== TextState.INIT) return;
    this.ctx.save();
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "top";

    this.ctx.translate(
      this.position.x + this.dimension.width / 2,
      this.position.y + this.dimension.height / 2
    );

    // this.ctx.strokeRect(
    //   -this.dimension.width / 2,
    //   -this.dimension.height / 2,
    //   this.dimension.width,
    //   this.dimension.height
    // );

    if (this.special > 1) {
      this.ctx.rotate(Math.PI);
    }
    this.ctx.fillText(
      this.data,
      -this.dimension.width / 2,
      -this.dimension.height / 2
    );
    this.ctx.translate(
      -(this.position.x + this.dimension.width / 2),
      -(this.position.y + this.dimension.height / 2)
    );
    this.ctx.restore();
  }

  renderParticles() {
    if (this.particles.length <= 0 || this.particleLifeTime <= 0) return;
    this.particles.forEach((particle, index) => {
      this.ctx.save();
      this.ctx.textAlign = "left";
      this.ctx.textBaseline = "top";
      this.ctx.globalAlpha = this.particleLifeTime / 100;

      const { x, y } = particle.getPosition();
      const { width, height } = particle.getDimension();
      this.ctx.translate(x + width / 2, y + height / 2);
      this.ctx.rotate(Math.PI / -(this.particleLifeTime / (index * 10)));
      this.ctx.fillText(particle.textData(), -width / 2, -height / 2);
      this.ctx.translate(-(x + width / 2), -(y + height / 2));

      this.ctx.restore();
    });
    this.particleLifeTime -= 1;
  }
}

export default Text;
