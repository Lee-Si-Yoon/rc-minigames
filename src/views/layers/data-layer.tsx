import BaseLayer from "./base-layer";
import { DataLayerConstructor, DataProps, Words } from "./model";
import Text from "../text/text";

/**
 * @url https://github.com/hyukson/hangul-util
 * @description 한글
 *
 */
class DataLayer extends BaseLayer {
  private data: DataProps = { words: [] };
  private texts: Text[] = [];
  private score: number = 0;

  private gravity: number = 0.5;

  constructor({ canvas, initData }: DataLayerConstructor) {
    super({ canvas });

    if (initData) {
      this.data = initData;
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

  updateGravity(value: number): void {
    this.gravity = this.gravity += value;
  }

  createTexts(words: Words): void {
    for (const word of words) {
      this.texts.push(new Text({ data: word, ctx: this.ctx }));
    }
  }

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
    // FIXME unify datasource to one
    this.texts.splice(indexOfParamText, 1);
    this.data.words.splice(indexOfWords, 1);
  }

  render(): void {
    const ctx = this.ctx;
    const canvas = { width: this.width, height: this.height };
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "24px serif";
    ctx.save();

    for (const [index, text] of this.texts.entries()) {
      const centerOfCanvas = canvas.width / 2;
      const { x, y } = text.getPosition();
      const { width, height } = text.getDimension();

      text.setPosition({
        x: centerOfCanvas - width / 2,
        y: (index + 1) * height * 2,
      });
      text.render({ x, y });

      // FIXME gravity is now cumulative
      // remove gravity and let each Text have own velocity
      // FIXME when text is deleted text moves upwards
      // do not render by index
      text.setVelocity({ x: 0, y: this.gravity });
      text.updatePositionByVelocity();
      this.updateGravity(0.5);
    }

    ctx.restore();
  }
}

export default DataLayer;
