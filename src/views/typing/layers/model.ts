/**
 * @description for initial data
 */
type Words = string[];

interface DataProps {
  words: Words;
  failed: Words;
}

interface CanvasLayerConstructor {
  canvas: HTMLCanvasElement;
}

interface DataLayerConstructor extends CanvasLayerConstructor {
  initData?: Words;
  words?: string[];
}

export { Words, DataProps, CanvasLayerConstructor, DataLayerConstructor };
