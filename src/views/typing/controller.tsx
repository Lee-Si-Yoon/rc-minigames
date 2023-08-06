import BackgroundLayer from "./layers/background-layer";
import EventDispatcher from "../../utils/eventDispatcher";
import DataLayer from "./layers/data-layer";
import InteractionLayer from "./layers/interaction-layer";
import { CanvasEvents } from "./events";
import {
  CanvasDataChangeParams,
  ControllerChangeParams,
  Level,
  Phase,
} from "./model";
import { Words } from "./layers/model";

interface ControllerConstructor {
  backgroundLayer: HTMLCanvasElement;
  dataLayer: HTMLCanvasElement;
  interactionLayer: HTMLCanvasElement;
  initData?: Words;
}

class Controller extends EventDispatcher {
  private width: number = 0;
  private height: number = 0;
  private dpr: number = 1;
  private element: HTMLCanvasElement;

  private backgroundLayer: BackgroundLayer;
  private dataLayer: DataLayer;
  private interactionLayer: InteractionLayer;

  private isPlaying: Phase = Phase.PAUSED;
  private level: Level = Level.EASY;

  private timeStamp: number = 0;
  private playTime: number = 0;
  private fps: number = 60;
  private interval: number = 1000 / this.fps;
  private rafId: number = 0;

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
      initData: initData,
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

  private setWidths(width: number, devicePixelRatio?: number) {
    this.width = width;
    this.backgroundLayer.setWidth(width, devicePixelRatio);
    this.dataLayer.setWidth(width, devicePixelRatio);
    this.interactionLayer.setWidth(width, devicePixelRatio);
  }

  private setHeights(height: number, devicePixelRatio?: number) {
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
    this.emit(CanvasEvents.CONTROLLER_EVENT, params);
  }

  emitCurrentData() {
    this.emitDataChangeEvent({
      data: this.dataLayer.getCopiedData(),
    });
  }

  emitControllerData() {
    const copiedData = JSON.parse(
      JSON.stringify({
        isPlaying: this.isPlaying,
        playTime: this.playTime,
        level: this.level,
      })
    );
    this.emitControllerChangeEvent({ data: copiedData });
  }

  setIsPlaying(phase: Phase) {
    this.isPlaying = phase;

    if (phase === Phase.END) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
      this.playTime = 0;
    } else if (phase === Phase.PAUSED) {
      cancelAnimationFrame(this.rafId);
    } else if (phase === Phase.PLAYING) {
      this.playFrames();
    }

    this.emitControllerData();
  }

  setLevel(level: Level) {
    this.level = level;
    this.dataLayer.setLevel(level);
    this.emitControllerData();
  }

  /**
   * @summary on keyboard event
   */
  removeWord(word: string) {
    this.dataLayer.updateScore(word);
    this.dataLayer.removeWordAndText(word);
    this.emitCurrentData();
  }

  addWord(word: string) {
    this.dataLayer.addWord(word);
    this.emitCurrentData();
  }

  playFrames(): void {
    let timer = 0;
    let lastTime = 0;

    const animate = (timeStamp: number) => {
      this.timeStamp = timeStamp;

      const deltaTime = timeStamp - lastTime;
      lastTime = timeStamp;

      if (timer > this.interval) {
        timer = 0;
        this.playGame();
      }

      this.rafId = requestAnimationFrame(animate);

      if (this.playTime === 0) {
        this.dataLayer.initialize();
      }

      timer += deltaTime;
      this.playTime += 1;
    };

    animate(this.timeStamp);
  }

  playGame() {
    // const prevData = JSON.stringify(this.dataLayer.getCopiedData());
    this.dataLayer.update();
    // const updatedData = JSON.stringify(this.dataLayer.getCopiedData());
    // if (prevData !== updatedData) this.emitControllerData();
    this.emitControllerData();
    this.dataLayer.render();
  }

  renderAll() {
    this.dataLayer.render();
    this.backgroundLayer.render();
    this.interactionLayer.render();
  }

  destroy() {
    // remove eventListners
  }
}

export default Controller;
