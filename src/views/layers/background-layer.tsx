import BaseLayer from "./base-layer";
import { CanvasLayerConstructor } from "./model";

class BackgroundLayer extends BaseLayer {
  constructor({ canvas }: CanvasLayerConstructor) {
    super({ canvas });
    this.ctx = canvas.getContext("2d")!;
    this.element = canvas;
  }

  render(): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.save();
    ctx.restore();
  }
}

export default BackgroundLayer;
