/**
 * @description for initial data
 */
type Words = string[];

interface DataProps {
  words: Words;
}

/**
 * TODO update to match business logic
 */
interface MetaData {
  score: number;
  words: Words;
  failedWords: Words;
}

interface CanvasLayerConstructor {
  canvas: HTMLCanvasElement;
}

interface DataLayerConstructor extends CanvasLayerConstructor {
  initData?: DataProps;
  words?: string[];
}

export {
  Words,
  DataProps,
  MetaData,
  CanvasLayerConstructor,
  DataLayerConstructor,
};
