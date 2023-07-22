/**
 * @description for initial data
 */
type Words = string[];

interface DataProps {
  words: Words;
  score?: number;
  failed?: Words;
}

interface CanvasLayerConstructor {
  canvas: HTMLCanvasElement;
}

interface DataLayerConstructor extends CanvasLayerConstructor {
  initData?: DataProps;
  words?: string[];
}

export { Words, DataProps, CanvasLayerConstructor, DataLayerConstructor };

/**
 * TODO
 * 1. separate what to recieve as props / what to emit
 * 2. after 1, differ listeners
 * 3. add modes, CORS
 *
 * receive as props
 * {
 *  initData: string[] -> transform as words -> receive as stream later
 *  fps?: number;
 *  gameTime?: number;
 * }
 *
 *
 * emit as data
 * {
 *  words: string[]
 *  score: number
 *  failed: string[]
 *  isPlaying: boolean
 * }
 *
 * at game end
 * post data
 */
