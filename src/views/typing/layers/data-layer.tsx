import BaseLayer from "../../../utils/base-layer";
import { DataLayerConstructor, DataProps } from "./model";
import { getRandomArbitrary } from "../../../utils/math";
import Text, { TextProps, TextState } from "../text/text";
import { Level } from "../model";

/**
 * @remark word is string, text is Text class
 */
class DataLayer extends BaseLayer {
  private initData: string[] = [];
  private texts: Text[] = [];
  private data: DataProps = { words: [], failed: [], score: 0 };

  private maxIndex: number = 500; // max index for brute force

  private level: Level = Level.EASY;

  constructor({ canvas, initData }: DataLayerConstructor) {
    super({ canvas });

    if (initData) {
      this.initData = initData;
      this.data = { words: initData, failed: [], score: 0 };
    }
  }

  resetAll(): void {
    this.texts = [];
    this.data.words = this.initData;
    this.data.failed = [];
    this.data.score = 0;
  }

  initialize(): void {
    this.resetAll();
    this.data.words.forEach((word) =>
      this.addWord({
        data: word,
      })
    );
  }

  setLevel(level: Level) {
    this.level = level;
  }

  getCopiedData(): DataProps {
    const data: DataProps = JSON.parse(JSON.stringify(this.data));
    return data;
  }

  addWord(textProps: Omit<TextProps, "ctx">): void {
    const canvas = { width: this.width, height: this.height };
    const { data: word, ...rest } = textProps;
    if (!word) throw new Error("invalid word");
    const self = new Text({ data: word, ctx: this.ctx, ...rest });

    this.data.words = [word, ...this.data.words];
    this.texts.push(self);

    const { width } = self.getDimension;
    self.setPosition = {
      x: getRandomArbitrary(0, canvas.width - width),
      y: getRandomArbitrary(-(canvas.height / 2), 0),
    };

    let textIndex = 0;

    while (textIndex < this.texts.length || textIndex < this.maxIndex) {
      let overLapped = false;
      this.texts.forEach((text) => {
        if (text !== self && self.getIsCollided(text)) {
          overLapped = true;
          self.setPosition = {
            x: getRandomArbitrary(0, canvas.width - width),
            y: getRandomArbitrary(-(canvas.height / 2), 0),
          };
        }
      });
      if (!overLapped) {
        if (this.level === Level.EASY) {
          self.setVelocity = { x: 0, y: 1 };
        } else if (this.level === Level.NORMAL) {
          self.setVelocity = {
            x: getRandomArbitrary(-0.25, 0.25),
            y: 1.25,
          };
        } else if (this.level === Level.HARD) {
          self.setVelocity = {
            x: getRandomArbitrary(-0.5, 0.5),
            y: 1.5,
          };
        }
        textIndex += 1;
      }
    }
  }

  private validateWord(word: string): boolean {
    // data.word can exist without being rendered
    return (
      this.data.words.includes(word) &&
      this.texts.map((text) => text.textData).includes(word)
    );
  }

  updateScore(word: string): void {
    if (!this.validateWord(word)) return;
    this.data.score +=
      this.texts.find((text) => text.textData === word)?.getScore || 0;
  }

  moveWordToFailed(word: string): void {
    const indexOfWords = this.data.words.indexOf(word);
    this.data.words.splice(indexOfWords, 1);
    this.data.failed.push(word);
  }

  removeViaInput(word: string): void {
    const indexOfWords = this.data.words.indexOf(word);
    if (indexOfWords >= 0) {
      this.data.words.splice(indexOfWords, 1);
    }
    // update text state to particled
    const stringArrayOfTexts: string[] = this.texts.map(
      (text) => text.textData
    );
    const indexOfParamText = stringArrayOfTexts.indexOf(word);
    if (indexOfParamText >= 0) {
      this.texts[indexOfParamText].setIsAlive = TextState.PARTICLED;
    }
  }

  update(): void {
    const canvas = { width: this.width, height: this.height };
    for (const text of this.texts) {
      const { x, y } = text.getPosition;

      // bottom fall
      if (y >= canvas.height) {
        this.moveWordToFailed(text.textData);
        this.removeViaInput(text.textData);
        const targetTextIndex = this.texts.indexOf(text);
        this.texts.splice(targetTextIndex, 1);
      }

      // collision
      if (this.level === Level.HARD) {
        const exceptSelf = this.texts.filter((other) => other !== text);

        exceptSelf.forEach((other) => {
          if (!text.getIsCollided(other)) return;
          const { x: otherPositionX, y: otherPositionY } = other.getPosition;
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

          text.setPosition = { x: newPosition.nx, y: newPosition.ny };
          text.setCollideVelocity = {
            x: text.getVelocityAfterCollision(other).x * 1,
            y: text.getVelocityAfterCollision(other).y * 1,
          };
        });
      }

      text.update();
    }
  }

  render(): void {
    const ctx = this.ctx;
    const canvas = { width: this.width, height: this.height };
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font =
      "bold 24px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif";
    ctx.fillStyle = "white";
    ctx.save();

    for (const text of this.texts) {
      text.render();
      text.renderParticles();
    }
    ctx.restore();
  }
}

export default DataLayer;
