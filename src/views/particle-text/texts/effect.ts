import Particle from "./particle";

interface EffectProps {
  context: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;
}

/**
 * @url https://www.youtube.com/watch?v=2F2t1RJoGt8
 */
class Effect {
  context: CanvasRenderingContext2D;
  canvasWidth: number = 0;
  canvasHeight: number = 0;

  private position: { x: number; y: number } = { x: 0, y: 0 };
  private fontSize: number = 80;

  private padding: number = 20;
  private maxTextWidth: number = 0;
  private lineHeight: number = 0;

  private particles: Particle[] = [];
  gap: number = 3;

  constructor({ context, canvasWidth, canvasHeight }: EffectProps) {
    this.context = context;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.maxTextWidth = this.canvasWidth - this.padding;
    this.lineHeight = this.fontSize;
  }

  getIfAllParticlesPositionedBackToOrigin(): boolean {
    return this.particles.every((particle) =>
      particle.getIfPositionIsBackToOrigin()
    );
  }

  styleText() {
    const ctx = this.context;
    const gradient = ctx.createLinearGradient(
      0,
      0,
      this.canvasWidth,
      this.canvasHeight
    );
    gradient.addColorStop(0.3, "red");
    gradient.addColorStop(0.5, "orange");
    gradient.addColorStop(0.7, "purple");
    ctx.fillStyle = gradient;
    ctx.font = `${this.fontSize}px Helvetica`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
  }

  wrapText(text: string) {
    const ctx = this.context;

    let lineCounter = 0;
    let line = "";
    const linesArray = [];
    const texts = text.split(" ");

    for (const [index] of texts.entries()) {
      const testLine = line + texts[index] + " ";
      if (ctx.measureText(testLine).width > this.maxTextWidth) {
        line = texts[index] + " ";
        lineCounter += 1;
      } else {
        line = testLine;
      }
      linesArray.push(line);
    }
    const textHeight = this.lineHeight * lineCounter;
    this.position.x = this.padding;
    this.position.y = this.canvasHeight - textHeight;

    linesArray.forEach((line, index) => {
      ctx.fillText(
        line,
        this.position.x,
        this.position.y + index * this.lineHeight
      );
    });
  }

  convertToParticles() {
    if (this.canvasWidth < 0 || this.canvasHeight < 0) {
      console.error("context is not set yet");
      return;
    }
    const pixels = this.context.getImageData(
      0,
      0,
      this.canvasWidth,
      this.canvasHeight
    ).data;
    // collect getImageData then clear canvas
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    for (let y = 0; y < this.canvasHeight; y += this.gap) {
      for (let x = 0; x < this.canvasWidth; x += this.gap) {
        /**
         * @description [red, green, blue, alpha] is one pixel
         */
        const index = (y * this.canvasWidth + x) * 4;
        const alpha = pixels[index + 3];
        // if alpha exitsts, it is not a empty pixel
        if (alpha > 0) {
          // const red = pixels[index];
          // const green = pixels[index + 1];
          // const blue = pixels[index + 2];
          // const color = `rgb(${red}, ${green}, ${blue})`;
          this.particles.push(
            new Particle({
              effect: this,
              position: { x, y },
            })
          );
        }
      }
    }
  }

  renderPlainTexts() {}

  renderParticles() {
    this.particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });
  }
}

export default Effect;
