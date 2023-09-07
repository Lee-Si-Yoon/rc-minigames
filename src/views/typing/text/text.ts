import { divideKOR, isKOR } from "../../../utils/parse-korean";
import { Coord } from "../../../utils/types";
import RigidBody from "./rigid-body";
import ScorableSubject from "./scorable";
import LifeCycleState from "./text-state";

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
  public ctx: CanvasRenderingContext2D;

  public data: string = "";
  private special: number = 1;

  public scorableSubject: ScorableSubject;

  public particles: Text[] = [];
  public particleLifeTime: number = 100;

  public LifeCycleState: LifeCycleState;

  constructor({ data, ctx }: TextProps) {
    super();

    this.ctx = ctx;
    this.data = data;

    this.scorableSubject = new ScorableSubject(this, this.special);

    this.LifeCycleState = new LifeCycleState({ Text: this });

    const getTextMetrics = (
      ctx: CanvasRenderingContext2D,
      data: string
    ): TextMetrics => ctx.measureText(data);

    this.dimension.width = getTextMetrics(ctx, data).width * 1;
    this.dimension.height =
      (getTextMetrics(ctx, data).actualBoundingBoxAscent +
        getTextMetrics(ctx, data).actualBoundingBoxDescent) *
      1;
  }

  getSpecial(): number {
    return this.scorableSubject.getSpecialty();
  }

  getScore(): number {
    return this.scorableSubject.getScore();
  }

  textData(): string {
    return this.data;
  }

  setIsAlive(state: TextState) {
    if (state === TextState.INIT) {
      this.LifeCycleState.setLifeCycle(this.LifeCycleState.Init);
    } else if (state === TextState.PARTICLED) {
      this.LifeCycleState.setLifeCycle(this.LifeCycleState.Particled);
    } else {
      this.LifeCycleState.setLifeCycle(this.LifeCycleState.Dead);
    }
  }

  update(): void {
    this.LifeCycleState.getLifeCycle().update();
  }

  render(): void {
    if (this.LifeCycleState.getLifeCycle() !== this.LifeCycleState.Init) return;
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
}

export default Text;
