import BaseLayer from "./base-layer";
import { DataLayerConstructor, DataProps } from "./model";

class DataLayer extends BaseLayer {
  private data: { score: number } = { score: 0 };

  constructor({ canvas, initData }: DataLayerConstructor) {
    super({ canvas });

    if (initData) {
      this.data = initData;
    }
  }

  getCopiedData(): DataProps {
    const data: DataProps = JSON.parse(JSON.stringify(this.data));
    return data;
  }

  render(): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    ctx.save();

    ctx.restore();
  }
}

export default DataLayer;
