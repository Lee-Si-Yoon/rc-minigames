import Text from "./text";

interface LifeCycle {
  LifeCycleState: LifeCycleState;
  Text: Text;

  toNextStep: VoidFunction;
  update: VoidFunction;
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

  update() {
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

  update() {
    this.Text.splitToParticle();
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

  update() {
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
