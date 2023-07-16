interface DataProps {
  score: number;
}

interface CanvasLayerConstructor {
  canvas: HTMLCanvasElement;
}

interface DataLayerConstructor extends CanvasLayerConstructor {
  initData?: DataProps;
}

export { DataProps, CanvasLayerConstructor, DataLayerConstructor };
