import BaseLayer from "../../../utils/base-layer";
import Effect from "../texts/effect";
import { CanvasLayerConstructor } from "./model";

interface PlainTextLayerProps extends CanvasLayerConstructor {
  text: string;
}

class PlainTextLayer extends BaseLayer {
  private renderAlignLines: boolean = false;
  private text: string = "";
  private inputValue: string = "";

  constructor({ canvas, text }: PlainTextLayerProps) {
    super({ canvas });

    this.text = text;
  }

  setInputValue(value: string) {
    this.inputValue = value;
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
    effect.renderStaticTexts();
  }
}

export default PlainTextLayer;

/**
 * {
 *  value: "text",
 *  position: {
 *    x: 0
 *    y: 0
 *  }
 * }[]
 */
