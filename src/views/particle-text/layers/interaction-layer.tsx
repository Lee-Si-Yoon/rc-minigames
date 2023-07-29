import BaseLayer from "../../../utils/base-layer";
import Effect from "../texts/effect";
import { CanvasLayerConstructor } from "./model";

class InteractionLayer extends BaseLayer {
  private renderAlignLines: boolean = false;

  constructor({ canvas }: CanvasLayerConstructor) {
    super({ canvas });
  }

  setDebugMode(bool: boolean) {
    this.renderAlignLines = bool;
  }

  renderDebugMode() {
    if (!this.renderAlignLines) return;

    const ctx = this.ctx;
    ctx.lineWidth = 3;
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(this.width / 2, 0);
    ctx.lineTo(this.width / 2, this.height);
    ctx.stroke();

    ctx.strokeStyle = "green";
    ctx.beginPath();
    ctx.moveTo(0, this.height / 2);
    ctx.lineTo(this.width, this.height / 2);
    ctx.stroke();
  }

  render(): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const text = "lorem ipsum I love macDonalds";

    const effect = new Effect({
      context: ctx,
      canvasWidth: this.width,
      canvasHeight: this.height,
    });

    effect.styleText();
    effect.wrapText(text);
    effect.convertToParticles();
    effect.render();

    const animate = () => {
      ctx.clearRect(0, 0, this.width, this.height);
      effect.render();
      requestAnimationFrame(animate);
    };
    animate();

    this.renderDebugMode();

    ctx.save();
    ctx.restore();
  }
}

export default InteractionLayer;
