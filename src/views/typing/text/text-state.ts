import { getRandomArbitrary } from "../../../utils/math";
import Text from "./text";

interface LifeCycle {
  LifeCycleState: LifeCycleState;
  Text: Text;

  toNextStep: VoidFunction;
  update: VoidFunction;
  renderParticles: VoidFunction;
}

class LifeCycleState {
  public Init: LifeCycle;
  public Particled: LifeCycle;
  public Dead: LifeCycle;

  public currentCycle: LifeCycle;

  constructor({ Text }: { Text: Text }) {
    this.Init = new Init(this, Text);
    this.Particled = new Particled(this, Text);
    this.Dead = new Dead(this, Text);

    this.currentCycle = this.Init;
  }

  public setLifeCycle(LifeCycle: LifeCycle) {
    this.currentCycle = LifeCycle;
  }

  public getLifeCycle(): LifeCycle {
    return this.currentCycle;
  }

  public getLifeCycleName(): string {
    return this.currentCycle.constructor.name;
  }
}

class Init implements LifeCycle {
  public LifeCycleState: LifeCycleState;
  public Text: Text;

  constructor(LifeCycleState: LifeCycleState, Text: Text) {
    this.LifeCycleState = LifeCycleState;
    this.Text = Text;
  }

  toNextStep() {
    this.LifeCycleState.setLifeCycle(this.LifeCycleState.Particled);
  }

  public renderParticles() {}

  public update() {
    const text = this.Text;
    text.position.x += text.velocity.x + text.collideVelocity.x;
    text.position.y += text.velocity.y + text.collideVelocity.y;

    if (text.collideVelocity.x > 0.1) text.collideVelocity.x *= 0.6;
    if (text.collideVelocity.y > 0.1) text.collideVelocity.y *= 0.6;
  }
}

class Particled implements LifeCycle {
  public LifeCycleState: LifeCycleState;
  public Text: Text;

  constructor(LifeCycleState: LifeCycleState, Text: Text) {
    this.LifeCycleState = LifeCycleState;
    this.Text = Text;
  }

  toNextStep() {
    this.LifeCycleState.setLifeCycle(this.LifeCycleState.Dead);
  }

  splitToParticle() {
    if (this.LifeCycleState.getLifeCycle() !== this.LifeCycleState.Particled)
      return;

    const text = this.Text;

    text.data.split("").forEach((d, i) => {
      text.particles.push(
        new Text({
          data: d,
          ctx: text.ctx,
        })
      );
      text.particles[i].setVelocity(text.velocity);
    });

    text.particles.forEach((particle, index) => {
      const { width } = particle.getDimension();
      const { x: veloX, y: veloY } = particle.velocity;
      particle.setPosition({
        x: text.position.x + (index + 1) * width,
        y: text.position.y,
      });
      particle.setVelocity({
        x: getRandomArbitrary(-veloX * 2 || -2, veloX * 2 || 2),
        y: getRandomArbitrary(veloY * 1, veloY * 2),
      });
    });
  }

  public renderParticles() {}

  public update() {
    this.splitToParticle();
    this.toNextStep();
  }
}

class Dead implements LifeCycle {
  public LifeCycleState: LifeCycleState;
  public Text: Text;

  constructor(LifeCycleState: LifeCycleState, Text: Text) {
    this.LifeCycleState = LifeCycleState;
    this.Text = Text;
  }

  toNextStep() {
    throw new Error("Already Dead");
  }

  public renderParticles() {
    const text = this.Text;
    if (text.particles.length <= 0 || text.particleLifeTime <= 0) return;
    text.particles.forEach((particle, index) => {
      text.ctx.save();
      text.ctx.textAlign = "left";
      text.ctx.textBaseline = "top";
      text.ctx.globalAlpha = text.particleLifeTime / 100;

      const { x, y } = particle.getPosition();
      const { width, height } = particle.getDimension();
      text.ctx.translate(x + width / 2, y + height / 2);
      text.ctx.rotate(Math.PI / -(text.particleLifeTime / (index * 10)));
      text.ctx.fillText(particle.textData(), -width / 2, -height / 2);
      text.ctx.translate(-(x + width / 2), -(y + height / 2));

      text.ctx.restore();
    });
    text.particleLifeTime -= 1;
  }

  public update() {
    const text = this.Text;
    if (text.particles.length <= 0) return;
    text.particles.forEach((particle) => {
      const { x: posX, y: posY } = particle.getPosition();
      const { x: veloX, y: veloY } = particle.getVelocity();
      particle.setPosition({
        x: posX + veloX,
        y: posY + veloY,
      });
    });
    if (text.particleLifeTime <= 0) {
      text.particles = [];
      text.particleLifeTime = 0;
    }
  }
}

export type { LifeCycle };

export default LifeCycleState;
