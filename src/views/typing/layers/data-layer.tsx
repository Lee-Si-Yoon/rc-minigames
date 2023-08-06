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

  private maxVelocity: number = 2;
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
    this.data.words.forEach((word) => this.addWord({ data: word }));
  }

  setLevel(level: Level) {
    this.level = level;
  }

  getCopiedData(): DataProps {
    const data: DataProps = JSON.parse(JSON.stringify(this.data));
    return data;
  }

  addWord(textProps: Omit<TextProps, "ctx">): void {
    const { data: word, ...rest } = textProps;
    if (this.texts.some((text) => text.getTextData() === word)) return;
    if (this.data.failed.some((failed) => failed === word)) return;

    this.data.words = this.data.words.includes(word)
      ? [...this.data.words]
      : [word, ...this.data.words];

    const canvas = { width: this.width, height: this.height };

    const self = new Text({ data: word, ctx: this.ctx, ...rest });
    const { width } = self.getDimension();
    self.setPosition({
      x: getRandomArbitrary(0, canvas.width - width),
      y: getRandomArbitrary(-(canvas.height / 2), 0),
    });
    this.texts.push(self);

    if (this.texts.length > 1) {
      let textIndex = 0;

      while (textIndex < this.texts.length || textIndex < this.maxIndex) {
        let overLapped = false;
        this.texts.forEach((text) => {
          if (text !== self && self.getIsCollided(text)) {
            overLapped = true;
            self.setPosition({
              x: getRandomArbitrary(0, canvas.width - width),
              y: getRandomArbitrary(-(canvas.height / 2), 0),
            });
          }
        });
        if (!overLapped) {
          if (this.level === Level.EASY) {
            self.setVelocity({ x: 0, y: 1 });
          } else if (this.level === Level.NORMAL) {
            self.setVelocity({
              x: getRandomArbitrary(-0.5, 0.5),
              y: getRandomArbitrary(0.5, this.maxVelocity),
            });
          } else if (this.level === Level.HARD) {
            self.setVelocity({
              x: getRandomArbitrary(-0.5, 0.5),
              y: getRandomArbitrary(1, this.maxVelocity * 1.5),
            });
          }
          textIndex += 1;
        }
      }
    }
  }

  private validateWord(word: string): boolean {
    // data.word can exist without being rendered
    return (
      this.data.words.includes(word) &&
      this.texts.map((text) => text.getTextData()).includes(word)
    );
  }

  updateScore(word: string): void {
    if (!this.validateWord(word)) return;
    this.data.score +=
      this.texts.find((text) => text.getTextData() === word)?.getScore() || 0;
  }

  moveWordToFailed(word: string): void {
    const indexOfWords = this.data.words.indexOf(word);
    this.data.words.splice(indexOfWords, 1);
    this.data.failed.push(word);
  }

  removeViaInput(word: string): void {
    const stringArrayOfTexts: string[] = this.texts.map((text) =>
      text.getTextData()
    );
    const indexOfParamText = stringArrayOfTexts.indexOf(word);
    if (indexOfParamText >= 0) {
      this.texts[indexOfParamText].setIsAlive(TextState.PARTICLED);
    }
    const indexOfWords = this.data.words.indexOf(word);
    if (indexOfWords >= 0) {
      this.data.words.splice(indexOfWords, 1);
    }
  }

  update(): void {
    const canvas = { width: this.width, height: this.height };
    for (const text of this.texts) {
      const word = text.getTextData();
      const { x, y } = text.getPosition();
      const { width } = text.getDimension();
      const { x: velocityX, y: velocityY } = text.getVelocity();

      // right & left side collision
      if (x + width > canvas.width) {
        text.setPosition({ x: x - 1, y });
        text.setVelocity({ x: -velocityX, y: velocityY });
      } else if (x < 0) {
        text.setPosition({ x: x + 1, y });
        text.setVelocity({ x: Math.abs(velocityX), y: velocityY });
      }

      // bottom fall
      if (y >= canvas.height) {
        this.moveWordToFailed(word);
        this.removeViaInput(word);
        const targetTextIndex = this.texts.indexOf(text);
        this.texts.splice(targetTextIndex, 1);
      }

      // collision
      if (this.level === Level.HARD) {
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
          text.setVelocity(text.getVelocityAfterCollision(other));
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
    ctx.font = "24px Arial";
    ctx.save();

    for (const text of this.texts) {
      const { x, y } = text.getPosition();
      const { width, height } = text.getDimension();
      if (
        x + width < canvas.width &&
        y + height < canvas.height &&
        x > 0 &&
        y > 0
      ) {
        text.render();
        text.renderParticles();
      }
    }
    ctx.restore();
  }
}

export default DataLayer;
