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

  private _level: Level = Level.EASY;

  constructor({ canvas, initData }: DataLayerConstructor) {
    super({ canvas });

    if (initData) {
      this.initData = initData;
      this.data = { words: initData, failed: [] };
    }
  }

  get texts() {
    return this.text;
  }

  set level(level: Level) {
    this._level = level;
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
    const ctx = this.ctx;
    const { data: word, ...rest } = textProps;
    if (!word) throw new Error("invalid word");
    const self = new Text({ data: word, ctx: this.ctx, ...rest });

    this.data.words = [word, ...this.data.words];
    this.texts.push(self);

    const { width } = self.getDimension;
    self.setPosition = {
      x: getRandomArbitrary(0, ctx.canvas.width - width),
      y: getRandomArbitrary(-(ctx.canvas.height / 2), 0),
    };

    let textIndex = 0;

    while (textIndex < this.texts.length || textIndex < this.maxIndex) {
      let overLapped = false;
      this.texts.forEach((text) => {
        if (text !== self && self.getIsCollided(text)) {
          overLapped = true;
          self.setPosition = {
            x: getRandomArbitrary(0, ctx.canvas.width - width),
            y: getRandomArbitrary(-(ctx.canvas.height / 2), 0),
          };
        }
      });
      if (overLapped) break;
      if (this._level === Level.EASY) {
        self.setVelocity = { x: 0, y: 1 };
      } else if (this._level === Level.NORMAL) {
        self.setVelocity = {
          x: getRandomArbitrary(-0.25, 0.25),
          y: 1.25,
        };
      } else if (this._level === Level.HARD) {
        self.setVelocity = {
          x: getRandomArbitrary(-0.5, 0.5),
          y: 1.5,
        };
      }
      textIndex += 1;
    }
  }

  validateWord(word: string): boolean {
    // data.word can exist without being rendered
    return (
      this.data.words.includes(word) &&
      this.texts.map((text) => text.textData).includes(word)
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
    const stringArrayOfTexts: string[] = this.texts.map(
      (text) => text.textData
    );
    const indexOfParamText = stringArrayOfTexts.indexOf(word);
    if (indexOfParamText >= 0) {
      this.texts[indexOfParamText].setIsAlive = TextState.PARTICLED;
    }
  }

  render(): void {}
}

export default DataLayer;
