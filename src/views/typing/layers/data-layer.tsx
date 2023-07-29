import BaseLayer from "../../../utils/base-layer";
import { DataLayerConstructor, DataProps } from "./model";
import { getRandomArbitrary } from "../../../utils/math";
import Text from "../text/text";
import { divideKOR, isKOR } from "../../../utils/parse-korean";
import {
  removeAllPunctuations,
  removeAllWhiteSpaces,
} from "../../../utils/strip-punctuation";

/**
 * @remark word is string, text is Text class
 */
class DataLayer extends BaseLayer {
  private initData: string[] = [];
  private texts: Text[] = [];
  private data: DataProps = { words: [], failed: [], score: 0 };

  private maxVelocity: number = 2;

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
    this.setInitialPositions(this.data.words);
  }

  getCopiedData(): DataProps {
    const data: DataProps = JSON.parse(JSON.stringify(this.data));
    return data;
  }

  getTextLength(): number {
    return this.texts.length;
  }

  getTexts(): Text[] {
    return this.texts;
  }

  addWord(word: string): void {
    const words = this.data.words;

    this.data = {
      words: [word, ...words],
      score: this.data.score,
      failed: this.data.failed,
    };

    const newText = new Text({ data: word, ctx: this.ctx });
    newText.setPosition({
      x: getRandomArbitrary(0, this.width - newText.getDimension().width),
      y: getRandomArbitrary(-(this.height / 2), 0),
    });
    this.texts.push(newText);

    let textIndex = 0;
    while (textIndex < this.texts.length) {
      let overLapped = false;
      this.texts.forEach((text) => {
        if (text !== newText) {
          if (newText.getIsCollided(text)) {
            overLapped = true;
            newText.setPosition({
              x: getRandomArbitrary(
                0,
                this.width - newText.getDimension().width
              ),
              y: getRandomArbitrary(-(this.height / 2), 0),
            });
          }
        }
      });
      if (!overLapped) {
        newText.setVelocity({
          x: getRandomArbitrary(-0.5, 0.5),
          y: getRandomArbitrary(0.5, this.maxVelocity),
        });
        textIndex += 1;
      }
    }
  }

  createTexts(words: string[]): void {
    if (words.length <= 0) return;
    for (const word of words) {
      const text = new Text({ data: word, ctx: this.ctx });
      this.texts.push(text);
    }
  }

  private validateWord(word: string): boolean {
    return (
      this.data.words.includes(word) &&
      this.texts.map((text) => text.getTextData()).includes(word)
    );
  }

  updateScore(word: string): void {
    if (!this.validateWord(word)) return;
    const parsedWord = removeAllWhiteSpaces(removeAllPunctuations(word));
    if (isKOR(parsedWord)) {
      const splitedKOR = divideKOR(parsedWord);
      this.data.score += splitedKOR.length;
    } else {
      this.data.score += parsedWord.length;
    }
  }

  /**
   * brute force bin packing
   */
  setInitialPositions(words: string[]): void {
    this.createTexts(words);

    let textIndex = 0;
    while (textIndex < this.texts.length) {
      const testObject = this.texts[textIndex];
      let overLapped = false;
      this.texts.forEach((text) => {
        if (text !== testObject) {
          if (testObject.getIsCollided(text)) {
            overLapped = true;
            testObject.setPosition({
              x: getRandomArbitrary(
                0,
                this.width - testObject.getDimension().width
              ),
              y: getRandomArbitrary(-(this.height / 2), 0),
            });
          }
        }
      });
      if (!overLapped) {
        testObject.setVelocity({
          x: getRandomArbitrary(-0.5, 0.5),
          y: getRandomArbitrary(0.5, this.maxVelocity),
        });
        textIndex += 1;
      }
    }
  }

  moveDataWordToFailed(word: string): void {
    const indexOfWords = this.data.words.indexOf(word);
    this.data.words.splice(indexOfWords, 1);
    this.data.failed.push(word);
  }

  spliceTextByString(word: string): void {
    const stringArrayOfTexts: string[] = this.texts.map((text) =>
      text.getTextData()
    );
    const indexOfParamText = stringArrayOfTexts.indexOf(word);
    if (indexOfParamText >= 0) {
      this.texts.splice(indexOfParamText, 1);
    }
    const indexOfWords = this.data.words.indexOf(word);
    if (indexOfWords >= 0) {
      this.data.words.splice(indexOfWords, 1);
    }
  }

  render(): void {
    const ctx = this.ctx;
    const canvas = { width: this.width, height: this.height };
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "24px serif";
    ctx.save();

    for (const text of this.texts) {
      const { x, y } = text.getPosition();
      text.render({ x, y });
    }

    ctx.restore();
  }
}

export default DataLayer;
