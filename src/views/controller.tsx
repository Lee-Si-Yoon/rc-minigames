import BackgroundLayer from "./layers/background-layer";
import EventDispatcher from "./utils/eventDispatcher";
import DataLayer from "./layers/data-layer";
import InteractionLayer from "./layers/interaction-layer";
import { CanvasEvents } from "./types";
import { CanvasDataChangeParams, ControllerChangeParams, Phase } from "./model";
import { DataProps } from "./layers/model";

interface ControllerConstructor {
  backgroundLayer: HTMLCanvasElement;
  dataLayer: HTMLCanvasElement;
  interactionLayer: HTMLCanvasElement;
  initData?: DataProps;
}

class Controller extends EventDispatcher {
  private width: number = 0;
  private height: number = 0;
  private dpr: number = 1;
  private element: HTMLCanvasElement;

  private backgroundLayer: BackgroundLayer;
  private dataLayer: DataLayer;
  private interactionLayer: InteractionLayer;

  private isPlaying: Phase = Phase.END;
  private timer: number = 0;
  private lastTime: number = 0;
  private fps: number = 60;
  private interval: number = 1000 / this.fps;

  constructor({
    backgroundLayer,
    dataLayer,
    interactionLayer,
    initData,
  }: ControllerConstructor) {
    super();

    this.backgroundLayer = new BackgroundLayer({
      canvas: backgroundLayer,
    });
    this.dataLayer = new DataLayer({
      canvas: dataLayer,
      initData,
    });
    this.interactionLayer = new InteractionLayer({
      canvas: interactionLayer,
    });

    this.element = interactionLayer;

    this.initialize();
  }

  initialize() {
    this.emit = this.emit.bind(this);
  }

  getCanvasElement(): HTMLCanvasElement {
    return this.element;
  }

  getIsPlaying(): Phase {
    return this.isPlaying;
  }

  setScales(x: number, y: number) {
    this.backgroundLayer.scale(x, y);
    this.dataLayer.scale(x, y);
    this.interactionLayer.scale(x, y);
  }

  setDprs(dpr: number) {
    this.dpr = dpr;
    this.backgroundLayer.setDpr(dpr);
    this.dataLayer.setDpr(dpr);
    this.interactionLayer.setDpr(dpr);
  }

  setWidths(width: number, devicePixelRatio?: number) {
    this.width = width;
    this.backgroundLayer.setWidth(width, devicePixelRatio);
    this.dataLayer.setWidth(width, devicePixelRatio);
    this.interactionLayer.setWidth(width, devicePixelRatio);
  }

  setHeights(height: number, devicePixelRatio?: number) {
    this.height = height;
    this.backgroundLayer.setHeight(height, devicePixelRatio);
    this.dataLayer.setHeight(height, devicePixelRatio);
    this.interactionLayer.setHeight(height, devicePixelRatio);
  }

  setSizes(width: number, height: number, devicePixelRatio?: number) {
    this.setWidths(width, devicePixelRatio);
    this.setHeights(height, devicePixelRatio);
    this.setDprs(devicePixelRatio ? devicePixelRatio : this.dpr);
  }

  setFps(fps: number) {
    this.fps = fps;
  }

  emitDataChangeEvent(params: CanvasDataChangeParams) {
    this.emit(CanvasEvents.DATA_CHANGE, params);
  }

  emitControllerChangeEvent(params: ControllerChangeParams) {
    this.emit(CanvasEvents.SET_ISPLAYING, params);
  }

  emitCurrentData() {
    this.emitDataChangeEvent({ data: this.dataLayer.getCopiedData() });
  }

  emitControllerData() {
    const copiedData = JSON.parse(
      JSON.stringify({ isPlaying: this.isPlaying })
    );
    this.emitControllerChangeEvent({ data: copiedData });
  }

  setIsPlaying(isPlaying: Phase) {
    this.isPlaying = isPlaying;
    this.backgroundLayer.render();
    this.playFrames();
    this.emitControllerData();
  }

  removeText(text: string) {
    this.dataLayer.spliceTextByString(text);
    this.emitCurrentData();
  }

  playGame() {
    if (this.lastTime === 0) {
      this.dataLayer.initialize();
    }

    const texts = this.dataLayer.getTexts();

    if (this.isPlaying === Phase.END) {
      this.lastTime = 0;
      this.dataLayer.setPositionsForTexts(texts);
      this.setIsPlaying(Phase.PAUSED);
    }

    this.dataLayer.render();

    if (this.isPlaying === Phase.PLAYING) {
      texts.forEach((text) => text.updatePositionByVelocity());
    }

    const overflowedText = texts.find(
      (text) => text.getPosition().y >= this.height
    );

    if (overflowedText) {
      this.removeText(overflowedText.getTextData());
      this.emitCurrentData();
    }

    if (texts.length <= 0) {
      this.setIsPlaying(Phase.END);
      this.dataLayer.render();
    }
  }

  playFrames(): void {
    const animate = (timeStamp: number) => {
      /**
       * @url https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame#examples
       * timeStamp is automatically allocated
       */
      const deltaTime = timeStamp - this.lastTime;
      this.lastTime = timeStamp;

      if (this.timer > this.interval) {
        this.timer = 0;
        this.playGame();
      }

      this.timer += deltaTime;

      if (this.isPlaying === Phase.PLAYING) {
        requestAnimationFrame(animate);
      }
    };
    /* this.lastTime is actual timeStamp */
    animate(this.lastTime);
  }

  destroy() {
    // remove eventListners
  }
}

export default Controller;
