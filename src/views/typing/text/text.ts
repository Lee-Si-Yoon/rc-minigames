import { getRandomArbitrary } from "../../../utils/math";
import { divideKOR, isKOR } from "../../../utils/parse-korean";
import {
  removeAllPunctuations,
  removeAllWhiteSpaces,
} from "../../../utils/strip-punctuation";
import { Coord } from "../../../utils/types";

export interface TextProps {
  data: string;
  ctx: CanvasRenderingContext2D;
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

class Text {
  protected ctx: CanvasRenderingContext2D;

  private data: string = "";
  private score: number = 0;
  private state: TextState = TextState.INIT;
  private special: number = 1;

  private position: Coord = { x: 0, y: 0 };
  private nextPosition: Coord = { x: 0, y: 0 };
  private velocity: Coord = { x: 0, y: 0 };
  private dimension: { width: number; height: number } = {
    width: 0,
    height: 0,
  };
  private mass: number = 1;
  private corFactor: number = 1.2;

  private particles: Text[] = [];
  private particleLifeTime: number = 100;

  constructor({ data, ctx, position, mass, velocity, special }: TextProps) {
    this.ctx = ctx;
    this.data = removeAllWhiteSpaces(removeAllPunctuations(data.trim()));

    this.position = position || { x: 0, y: 0 };
    this.velocity = velocity || { x: 0, y: 0 };
    this.mass = mass || 1;
    this.special = special || 1;

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

  getScore(): number {
    return this.score;
  }

  getPosition(): Coord {
    return this.position;
  }

  getDimension(): { width: number; height: number } {
    return this.dimension;
  }

  getVelocity(): Coord {
    return this.velocity;
  }

  getVelocityAfterCollision(collidedText: Text): Coord {
    /**
     * @url https://github.com/DongChyeon/JS-Toy-Projects/blob/master/AirHockey/game.js#L22C28-L22C28
     * @url https://velog.io/@dongchyeon/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%A1%9C-%EC%97%90%EC%96%B4-%ED%95%98%ED%82%A4-%EA%B2%8C%EC%9E%84%EC%9D%84-%EB%A7%8C%EB%93%A4%EC%96%B4%EB%B3%B4%EC%9E%90
     */
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
    return (
      this.position.x + this.dimension.width >= collidedText.position.x &&
      this.position.x <=
        collidedText.position.x + collidedText.dimension.width &&
      this.position.y + this.dimension.height >= collidedText.position.y &&
      this.position.y <= collidedText.position.y + collidedText.dimension.height
    );
  }

  getTextData(): string {
    return this.data;
  }

  setPosition(position: Coord): void {
    this.position = position;
  }

  setVelocity(velocity: Coord): void {
    this.velocity = velocity;
  }

  setIsAlive(state: TextState) {
    this.state = state;
  }

  update(): void {
    if (this.state === TextState.INIT) {
      this.nextPosition.x = this.position.x + this.velocity.x;
      this.nextPosition.y = this.position.y + this.velocity.y;
    }
    if (this.state === TextState.PARTICLED) {
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
    }

    if (this.particleLifeTime <= 0) {
      this.particles = [];
    }

    this.position.x = this.nextPosition.x;
    this.position.y = this.nextPosition.y;
  }

  render(): void {
    if (this.state !== TextState.INIT) return;
    this.ctx.save();
    this.ctx.translate(
      this.position.x + this.dimension.width / 2,
      this.position.y + this.dimension.height / 2
    );
    this.ctx.strokeRect(
      -this.dimension.width / 2,
      -this.dimension.height / 2,
      this.dimension.width,
      this.dimension.height
    );
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
      this.ctx.globalAlpha = this.particleLifeTime / 100;

      const text = particle.getTextData();
      const { x, y } = particle.getPosition();
      const { width, height } = particle.getDimension();
      this.ctx.translate(x + width / 2, y + height / 2);
      this.ctx.rotate(Math.PI / -(this.particleLifeTime / (index * 10)));
      this.ctx.fillText(text, -width / 2, -height / 2);
      this.ctx.translate(-(x + width / 2), -(y + height / 2));

      this.ctx.restore();
    });
    this.particleLifeTime -= 1;
  }
}

export default Text;
