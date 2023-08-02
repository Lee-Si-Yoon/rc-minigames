import BaseLayer from "../../../utils/base-layer";
import Effect from "../texts/effect";
// import Particle from "../texts/particle";
import { CanvasLayerConstructor } from "./model";

interface ParticleTextLayerProps extends CanvasLayerConstructor {
  text: string;
}

class ParticleTextLayer extends BaseLayer {
  private text: string = "";
  private inputValue: string = "";

  constructor({ canvas, text }: ParticleTextLayerProps) {
    super({ canvas });

    this.text = text;
  }

  setInputValue(value: string) {
    this.inputValue = value;
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const effect = new Effect({
      context: ctx,
      text: this.text,
      inputValue: this.inputValue,
      canvasWidth: this.width,
      canvasHeight: this.height,
    });

    effect.wrapText();
    effect.renderInputText(this.inputValue);
    // effect.renderFilledTexts();
    // effect.convertToParticles();

    const animate = () => {
      ctx.clearRect(0, 0, this.width, this.height);
      effect.renderParticles();
      const isBackToOrigin = effect.getIfAllParticlesPositionedBackToOrigin();
      if (!isBackToOrigin) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  test() {
    const ctx = this.ctx;

    const text = "Hello world!";
    const blur = 10;
    const width = ctx.measureText(text).width + blur * 2;
    ctx.font = "40px Arial";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.shadowColor = "#000";
    ctx.shadowOffsetX = width;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = blur;
    ctx.fillText(text, -width, 40);
  }
}

export default ParticleTextLayer;
