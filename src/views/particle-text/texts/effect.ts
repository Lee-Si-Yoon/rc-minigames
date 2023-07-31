// import { findDifferingSubstring } from "../../../utils/parse-string";
import { Coord } from "../../../utils/types";
import Particle from "./particle";

interface EffectProps {
  text: string;
  inputValue: string;
  context: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;
}

/**
 * @url https://www.youtube.com/watch?v=2F2t1RJoGt8
 */
class Effect {
  private context: CanvasRenderingContext2D;
  private canvasWidth: number = 0;
  private canvasHeight: number = 0;
  private gap: number = 3;

  private text: string = "";
  private inputValue: string = "";
  private textBoxPosition: Coord = { x: 0, y: 0 };
  private fontSize: number = 64;
  private lineHeight: number = 1.4;

  private padding: number = 16;
  private maxTextWidth: number = 0;
  private textArray: {
    value: string;
    filled: boolean;
    row: number;
    position: Coord;
    width: number;
    height: number;
  }[] = [];

  private particles: Particle[] = [];

  constructor({
    context,
    canvasWidth,
    canvasHeight,
    text,
    inputValue,
  }: EffectProps) {
    this.context = context;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.text = text;
    this.inputValue = inputValue;

    this.maxTextWidth = this.canvasWidth - this.padding;
  }

  private styleText(ctx: CanvasRenderingContext2D) {
    ctx.font = `${this.fontSize}px monospace`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.save();
  }

  private gradientFillText(ctx: CanvasRenderingContext2D) {
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
  }

  wrapText() {
    const ctx = this.context;
    this.styleText(ctx);

    const words = this.text.split(/(\s+)/); // 공백을 유지하며 단어를 나눔
    let currentX = this.padding;
    let currentY = 0;
    let row = 0;

    for (const word of words) {
      const wordWidth = ctx.measureText(word).width;
      const wordHeight =
        (ctx.measureText(word).actualBoundingBoxAscent +
          ctx.measureText(word).actualBoundingBoxDescent) *
        1.4;

      // Check if the word is just a space
      if (word.trim() === "") {
        // Move to the next word
        currentX += wordWidth;
        continue; // Skip adding the space to this.textArray
      }

      if (currentX + wordWidth < this.maxTextWidth) {
        for (const letter of word) {
          const letterWidth = ctx.measureText(letter).width;
          const letterHeight =
            (ctx.measureText(letter).actualBoundingBoxAscent +
              ctx.measureText(letter).actualBoundingBoxDescent) *
            this.lineHeight;

          this.textArray.push({
            value: letter,
            position: { x: currentX, y: currentY },
            row,
            filled: !this.inputValue.includes(letter),
            width: letterWidth,
            height: letterHeight,
          });

          currentX += letterWidth;
        }
      } else {
        currentX = this.padding;
        row++;
        currentY += wordHeight;

        for (const letter of word) {
          const letterWidth = ctx.measureText(letter).width;
          const letterHeight =
            (ctx.measureText(letter).actualBoundingBoxAscent +
              ctx.measureText(letter).actualBoundingBoxDescent) *
            this.lineHeight;

          this.textArray.push({
            value: letter,
            position: { x: currentX, y: currentY },
            row,
            filled: !this.inputValue.includes(letter),
            width: letterWidth,
            height: letterHeight,
          });

          currentX += letterWidth;
        }
      }
    }
  }

  renderStaticTexts() {
    const ctx = this.context;

    const maxTextHeight = Math.max(
      ...this.textArray.map((text) => text.height)
    );
    const maxRowCount = Math.max(...this.textArray.map((text) => text.row));
    this.textBoxPosition.y =
      this.canvasHeight - maxTextHeight * (maxRowCount + 1);

    // const filledRowCount =
    //   (maxRowCount + 1) * 2 -
    //   new Set(
    //     this.textArray.filter((text) => text.filled).map((text) => text.row)
    //   ).size;
    // this.textBoxPosition.y = this.canvasHeight - maxTextHeight * filledRowCount;

    // this.textBoxPosition.y = this.canvasHeight / 2 - maxTextHeight / 2;

    this.textArray.forEach((text) => {
      if (text.filled) {
        ctx.fillStyle = "gray";
        ctx.fillText(
          text.value,
          text.position.x,
          text.position.y + this.textBoxPosition.y,
          text.width
        );
      } else {
        this.gradientFillText(ctx);
        ctx.fillText(
          text.value,
          text.position.x,
          text.position.y + this.textBoxPosition.y,
          text.width
        );
      }
    });
  }

  getIfAllParticlesPositionedBackToOrigin(): boolean {
    return this.particles.every((particle) =>
      particle.getIfPositionIsBackToOrigin()
    );
  }

  renderFilledTexts() {
    const ctx = this.context;
    this.gradientFillText(ctx);

    const maxTextHeight = Math.max(
      ...this.textArray.map((text) => text.height)
    );
    const maxRowCount = Math.max(...this.textArray.map((text) => text.row));
    this.textBoxPosition.y =
      this.canvasHeight - maxTextHeight * (maxRowCount + 1);

    this.textArray.forEach((text) => {
      if (!text.filled) {
        ctx.fillText(
          text.value,
          text.position.x,
          text.position.y + this.textBoxPosition.y,
          text.width
        );
      }
    });
  }

  convertToParticles() {
    if (this.canvasWidth <= 0 || this.canvasHeight <= 0) {
      console.error("context is not set yet");
      return;
    }
    const ctx = this.context;

    this.textArray.forEach((text) => {
      if (!text.filled) {
        const pixels = ctx.getImageData(
          text.position.x,
          text.position.y + this.textBoxPosition.y,
          text.width,
          text.height
        ).data;

        // for debugging
        // ctx.putImageData(
        //   pixels,
        //   text.position.x,
        //   text.position.y + this.textBoxPosition.y + 100
        // );

        ctx.clearRect(
          text.position.x,
          text.position.y + this.textBoxPosition.y,
          text.width,
          text.height
        );

        for (let y = 0; y < text.height; y += this.gap) {
          for (let x = 0; x < text.width; x += this.gap) {
            const index = (y * text.width + x) * 4;
            const alpha = pixels[index + 3];
            if (alpha > 0) {
              this.particles.push(
                new Particle({
                  context: this.context,
                  canvasHeight: this.canvasHeight,
                  canvasWidth: this.canvasWidth,
                  size: this.gap,
                  position: {
                    x: text.position.x + x,
                    y: text.position.y + this.textBoxPosition.y + y,
                  },
                })
              );
            }
          }
        }
      }
    });
  }

  renderParticles() {
    this.particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });
  }
}

export default Effect;
