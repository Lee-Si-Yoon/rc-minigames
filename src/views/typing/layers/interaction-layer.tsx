import BaseLayer from "../../../utils/base-layer";
import { CanvasLayerConstructor } from "./model";

class InteractionLayer extends BaseLayer {
  constructor({ canvas }: CanvasLayerConstructor) {
    super({ canvas });
  }
  render(): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
  }
}

export default InteractionLayer;
