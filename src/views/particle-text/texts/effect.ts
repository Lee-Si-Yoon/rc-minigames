import Particle from "./particle";

interface EffectProps {
  context: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;
}

class Effect {
  context: CanvasRenderingContext2D;
  canvasWidth: number = 0;
  canvasHeight: number = 0;

  private position: { x: number; y: number } = { x: 0, y: 0 };
  private fontSize: number = 80;
  private maxTextWidth: number = 0;
  private lineHeight: number = 0;

  particles: Particle[] = [];
  gap: number = 3;

  constructor({ context, canvasWidth, canvasHeight }: EffectProps) {
    this.context = context;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.position = {
      x: this.canvasWidth / 2,
      y: this.canvasHeight / 2,
    };
    this.maxTextWidth = this.canvasWidth;
    this.lineHeight = this.fontSize * 0.8;
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
    ctx.textAlign = "center";
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
        line = texts[index] + "";
        lineCounter += 1;
      } else {
        line = testLine;
      }
      linesArray[lineCounter] = line;
    }
    const textHeight = this.lineHeight * lineCounter;
    this.position.x = this.canvasWidth / 2;
    this.position.y = this.canvasHeight / 2 - textHeight / 2;

    linesArray.forEach((line, index) => {
      ctx.fillText(
        line,
        this.position.x,
        this.position.y + index * this.lineHeight
      );
    });
  }

  convertToParticles() {
    const pixels = this.context.getImageData(
      0,
      0,
      this.canvasWidth,
      this.canvasHeight
    ).data;

    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    for (let y = 0; y < this.canvasHeight; y += this.gap) {
      for (let x = 0; x < this.canvasWidth; x += this.gap) {
        /**
         * @description [red, green, blue, alpha] is one pixel
         */
        const index = (y * this.canvasWidth + x) * 4;
        const alpha = pixels[index + 3];
        if (alpha > 0) {
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          const color = `rgb(${red}, ${green}, ${blue})`;
          this.particles.push(
            new Particle({
              effect: this,
              position: { x, y },
              color,
            })
          );
        }
      }
    }
  }

  render() {
    this.particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });
  }
}

export default Effect;
