import BaseLayer from "./base-layer";
import { DataLayerConstructor, DataProps } from "./model";
import Text from "../text/text";

/**
 * @remark word is string, text is Text class
 */
class DataLayer extends BaseLayer {
  private texts: Text[] = [];
  private data: DataProps = { words: [], failed: [], score: 0 };

  constructor({ canvas, initData }: DataLayerConstructor) {
    super({ canvas });

    if (initData) {
      this.data = { words: initData, failed: [], score: 0 };
    }
  }

  resetAll(): void {
    this.texts = [];
  }

  initialize(): void {
    this.resetAll();
    this.createTexts(this.data.words);
    this.setPositionsForTexts(this.texts);
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
    this.texts.push(newText);

    const { width, height } = newText.getDimension();
    newText.setPosition({
      x: this.width / 2 - width / 2,
      y: 1 * height * 2,
    });
    newText.setVelocity({ x: 0, y: 1 });
  }

  private createTexts(words: string[]): void {
    if (words.length <= 0) return;
    for (const word of words) {
      const text = new Text({ data: word, ctx: this.ctx });
      this.texts.push(text);
    }
  }

  detectKorean(word: string) {
    const KOR = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;
    return KOR.test(word);
  }

  updateScore(word: string) {
    /**
     * @url https://github.com/hyukson/hangul-util
     * TODO
     * 1. extract to independent method
     * 2. KOR score
     */
    if (!this.detectKorean(word)) {
      this.data.score += word.length;
    }
  }

  setPositionsForTexts(texts: Text[]): void {
    if (!texts) return;
    for (const [index, text] of texts.entries()) {
      const { width, height } = text.getDimension();
      // FIXME center canvas
      text.setPosition({
        x: this.width / 2 - width,
        // FIXME get correct height
        y: (index + 1) * height * 2,
      });
      text.setVelocity({ x: 0, y: 1 });
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
      this.updateScore(word);
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
