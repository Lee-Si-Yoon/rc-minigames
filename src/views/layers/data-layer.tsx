import BaseLayer from "./base-layer";
import { DataLayerConstructor, DataProps, Words } from "./model";
import Text from "../text/text";

/**
 * @url https://github.com/hyukson/hangul-util
 * @description 한글
 */
class DataLayer extends BaseLayer {
  private data: DataProps = { words: [] };
  private texts: Text[] = [];
  private score: number = 0;

  constructor({ canvas, initData }: DataLayerConstructor) {
    super({ canvas });

    if (initData) {
      this.data = initData;
      // FIXME extending center canvas, initializing should be called after canvas has width
      this.initialize();
    }
  }

  initialize(): void {
    this.createTexts(this.data.words);
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

  createTexts(words: Words): void {
    for (const [index, word] of words.entries()) {
      const text = new Text({ data: word, ctx: this.ctx });
      this.texts.push(text);
      const { width, height } = text.getDimension();
      // FIXME center canvas
      text.setPosition({
        x: this.width / 2 - width / 2,
        // FIXME get correct height
        y: (index + 1) * height * 2,
      });
      text.setVelocity({ x: 0.5, y: 0.5 });
    }
  }

  // FIXME unify datasource to one
  spliceTextByIndex(index: number): void {
    this.texts.splice(index, 1);
    this.data.words.splice(index, 1);
  }

  spliceTextByString(text: string): void {
    const stringArrayOfTexts: string[] = [];
    for (const t of this.texts) {
      stringArrayOfTexts.push(t.getTextData());
    }
    const indexOfParamText = stringArrayOfTexts.indexOf(text);
    const indexOfWords = this.data.words.indexOf(text);
    this.texts.splice(indexOfParamText, 1);
    this.data.words.splice(indexOfWords, 1);
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

      text.updatePositionByVelocity();
    }

    ctx.restore();
  }
}

export default DataLayer;
