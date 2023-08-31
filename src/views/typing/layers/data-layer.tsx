import BaseLayer from "../../../utils/base-layer";
import { getRandomArbitrary } from "../../../utils/math";
import { Level } from "../model";
import Text, { TextProps, TextState } from "../text/text";
import { DataLayerConstructor, DataProps } from "./model";

class DataLayer extends BaseLayer {
  private initData: string[] = [];
  private text: Text[] = [];
  private data: DataProps = { words: [], failed: [] };

  private maxIndex: number = 500; // max index for brute force

  private level: Level = Level.EASY;

  constructor({ canvas, initData }: DataLayerConstructor) {
    super({ canvas });

    if (initData) {
      this.initData = initData;
      this.data = { words: initData, failed: [] };
    }
  }

  getTexts() {
    return this.text;
  }

  setLevel(level: Level) {
    this.level = level;
  }

  resetAll(): void {
    this.text = [];
    this.data.words = this.initData;
    this.data.failed = [];
  }

  initialize(): void {
    this.resetAll();
    this.data.words.forEach((word) =>
      this.addWord({
        data: word,
      })
    );
  }

  getCopiedData(): DataProps {
    const data: DataProps = JSON.parse(JSON.stringify(this.data));
    return data;
  }

  addWord(textProps: Omit<TextProps, "ctx">): void {
    const { data: word, ...rest } = textProps;
    if (!word) throw new Error("invalid word");
    const self = new Text({ data: word, ctx: this.ctx, ...rest });

    const { width } = self.getDimension();

    self.setPosition({
      x: getRandomArbitrary(0, this.width - width),
      y: getRandomArbitrary(-(this.height / 4), 0),
    });

    // let textIndex = 0;

    // while (textIndex < this.texts.length || textIndex < this.maxIndex) {
    //   let overLapped = false;
    //   this.texts.forEach((text) => {
    //     const { x } = text.getPosition;
    //     if (
    //       (text !== self && self.getIsCollided(text)) ||
    //       x < 0 ||
    //       x + width > this.width
    //     ) {
    //       overLapped = true;
    //       self.setPosition = {
    //         x: getRandomArbitrary(0, ctx.canvas.width - width),
    //         y: getRandomArbitrary(
    //           -(ctx.canvas.height / 4),
    //           ctx.canvas.height / 2
    //         ),
    //       };
    //     }
    //   });
    //   if (overLapped) break;
    //   if (this._level === Level.EASY) {
    //     self.setVelocity = { x: 0, y: getRandomArbitrary(0.5, 1) };
    //   } else if (this._level === Level.NORMAL) {
    //     self.setVelocity = {
    //       x: getRandomArbitrary(0, 0.25),
    //       y: getRandomArbitrary(0.75, 1),
    //     };
    //   } else if (this._level === Level.HARD) {
    //     self.setVelocity = {
    //       x: getRandomArbitrary(0, 0.5),
    //       y: getRandomArbitrary(1, 1.25),
    //     };
    //   }
    //   textIndex += 1;
    // }

    if (this.level === Level.EASY) {
      self.setVelocity({ x: 0, y: getRandomArbitrary(0.5, 1) });
    } else if (this.level === Level.NORMAL) {
      self.setVelocity({
        x: getRandomArbitrary(0, 0.25),
        y: getRandomArbitrary(0.75, 1),
      });
    } else if (this.level === Level.HARD) {
      self.setVelocity({
        x: getRandomArbitrary(0, 0.5),
        y: getRandomArbitrary(1, 1.25),
      });
    }

    this.data.words = [word, ...this.data.words];
    this.text.push(self);
  }

  validateWord(word: string): boolean {
    // data.word can exist without being rendered
    return (
      this.data.words.includes(word) &&
      this.text.map((text) => text.textData()).includes(word)
    );
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
    const stringArrayOfTexts: string[] = this.text.map((text) =>
      text.textData()
    );
    const indexOfParamText = stringArrayOfTexts.indexOf(word);
    if (indexOfParamText >= 0) {
      this.text[indexOfParamText].setIsAlive(TextState.PARTICLED);
    }
  }

  render(): void {}
}

export default DataLayer;
