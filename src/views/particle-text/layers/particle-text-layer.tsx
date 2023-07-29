import BaseLayer from "../../../utils/base-layer";
import Effect from "../texts/effect";
import { CanvasLayerConstructor } from "./model";

interface ParticleTextLayerProps extends CanvasLayerConstructor {
  text: string;
}

class ParticleTextLayer extends BaseLayer {
  private text: string = "";

  constructor({ canvas, text }: ParticleTextLayerProps) {
    super({ canvas });

    this.text = text;
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const effect = new Effect({
      context: ctx,
      canvasWidth: this.width,
      canvasHeight: this.height,
    });

    effect.styleText();
    effect.wrapText(this.text);
    effect.convertToParticles();

    const animate = () => {
      ctx.clearRect(0, 0, this.width, this.height);
      effect.renderParticles();
      const isBackToOrigin = effect.getIfAllParticlesPositionedBackToOrigin();
      if (!isBackToOrigin) {
        requestAnimationFrame(animate);
      }
    };
    animate();

    ctx.save();
    ctx.restore();
  }
}

export default ParticleTextLayer;
