import BackgroundLayer from "./layers/background-layer";
import EventDispatcher from "./utils/eventDispatcher";
import DataLayer from "./layers/data-layer";
import InteractionLayer from "./layers/interaction-layer";
import { CanvasEvents } from "./types";
import { CanvasDataChangeParams, ControllerChangeParams } from "./model";
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

  private isPlaying: boolean = false;
  private fps: number = 60;

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

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getCanvasElement(): HTMLCanvasElement {
    return this.element;
  }

  getIsPlaying(): boolean {
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

  setIsPlaying(isPlaying: boolean) {
    this.isPlaying = isPlaying;
    this.backgroundLayer.render();
    this.play();
    this.emitControllerData();
  }

  setFps(fps: number) {
    this.fps = fps;
  }

  removeText(text: string) {
    this.dataLayer.spliceTextByString(text);
    this.emitCurrentData();
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

  play() {
    if (!this.isPlaying) return;

    const texts = this.dataLayer.getTexts();
    const overflowedText = texts.find(
      (text) => text.getPosition().y >= this.height
    );

    if (overflowedText) {
      const indexOfOverflowedText = texts.indexOf(overflowedText);
      this.dataLayer.spliceTextByIndex(indexOfOverflowedText);
      this.emitCurrentData();
    }

    if (texts.length <= 0) {
      this.setIsPlaying(false);
    }

    this.dataLayer.render();

    setTimeout(() => {
      requestAnimationFrame(() => this.play());
    }, 1000 / this.fps);
  }

  destroy() {
    // remove eventListners
  }
}

export default Controller;
