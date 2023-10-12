import BaseLayer from '../../../utils/base-layer';
import type { CanvasLayerConstructor } from './model';

class InteractionLayer extends BaseLayer {
  constructor({ canvas }: CanvasLayerConstructor) {
    super({ canvas });
  }

  render(): void {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.width, this.height);
  }
}

export default InteractionLayer;
