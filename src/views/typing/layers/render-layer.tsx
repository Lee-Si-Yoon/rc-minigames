import BaseLayer from "../../../utils/base-layer";
import { CanvasLayerConstructor } from "./model";
import Text from "../text/text";
import { Level } from "../model";

class RenderLayer extends BaseLayer {
  private texts: Text[] = [];
  private level: Level = Level.EASY;

  constructor({ canvas }: CanvasLayerConstructor) {
    super({ canvas });
  }

  setTexts(texts: Text[]) {
    this.texts = texts;
  }

  setLevel(level: Level) {
    this.level = level;
  }

  update(): void {
    for (const text of this.texts) {
      const { x, y } = text.getPosition();
      const { width } = text.getDimension();
      const { x: velX, y: velY } = text.getVelocity();

      if (x + width > this.width) {
        text.setPosition({ x: x - 1, y });
        text.setVelocity({ x: velX * -1, y: velY });
      } else if (x < 0) {
        text.setPosition({ x: x + 1, y });
        text.setVelocity({ x: velX * -1, y: velY });
      }

      // collision
      // if (this._level === Level.HARD) {
      const exceptSelf = this.texts.filter((other) => other !== text);

      exceptSelf.forEach((other) => {
        if (!text.getIsCollided(other)) return;
        const { x: otherPositionX, y: otherPositionY } = other.getPosition();
        const isSelfOnTop = y < otherPositionY;
        const isSelfOnRight = x > otherPositionX;
        const newPosition = { nx: x, ny: y };

        if (isSelfOnRight) {
          newPosition.nx = x + 1;
        } else {
          newPosition.nx = x - 1;
        }
        if (isSelfOnTop) {
          newPosition.ny = y - 1;
        } else {
          newPosition.ny = y + 1;
        }

        text.setPosition({ x: newPosition.nx, y: newPosition.ny });
        text.setCollideVelocity({
          x: text.getVelocityAfterCollision(other).x * 1,
          y: text.getVelocityAfterCollision(other).y * 1,
        });
      });
      // }

      text.update();
    }
  }

  render(): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.clearRect(0, 0, this.width, this.height);

    for (const text of this.texts) {
      text.render();
      text.renderParticles();
    }
    ctx.restore();
  }
}

export default RenderLayer;
