import EventDispatcher from "../../utils/eventDispatcher";
import RenderLayer from "./layers/render-layer";
import DataLayer from "./layers/data-layer";
import { CanvasEvents } from "./events";
import {
  CanvasDataChangeParams,
  ControllerChangeParams,
  Level,
  Phase,
  TimerChangeParams,
} from "./model";
import { Words } from "./layers/model";
import { TextProps } from "./text/text";

interface ControllerConstructor {
  renderLayer: HTMLCanvasElement;
  initData?: Words;
}

class Controller extends EventDispatcher {
  private width: number = 0;
  private height: number = 0;
  private dpr: number = 1;
  private element: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private renderLayer: RenderLayer;
  private dataLayer: DataLayer;

  private isPlaying: Phase = Phase.PAUSED;
  private level: Level = Level.EASY;
  private score: number = 0;

  private timeStamp: number = 0;
  private playTime: number = 0;
  private fps: number = 60;
  private interval: number = 1000 / this.fps; // 16fps
  private rafId: number = 0;

  constructor({ renderLayer, initData }: ControllerConstructor) {
    super();

    this.renderLayer = new RenderLayer({
      canvas: renderLayer,
    });
    this.dataLayer = new DataLayer({
      canvas: renderLayer,
      initData: initData,
    });

    this.element = renderLayer;
    this.ctx = this.element.getContext("2d", { willReadFrequently: true })!;

    this.initialize();
  }

  private initialize() {
    this.emit = this.emit.bind(this);
  }

  getCanvasElement(): HTMLCanvasElement {
    return this.element;
  }

  setScales(x: number, y: number) {
    this.renderLayer.scale(x, y);
    this.dataLayer.scale(x, y);
  }

  setDprs(dpr: number) {
    this.dpr = dpr;
    this.renderLayer.setDpr(dpr);
    this.dataLayer.setDpr(dpr);
  }

  private setWidths(width: number, devicePixelRatio?: number) {
    this.width = width;
    this.renderLayer.setWidth(width ?? this.width, devicePixelRatio);
    this.dataLayer.setWidth(width ?? this.width, devicePixelRatio);
  }

  private setHeights(height: number, devicePixelRatio?: number) {
    this.height = height;
    this.renderLayer.setHeight(height ?? this.height, devicePixelRatio);
    this.dataLayer.setHeight(height ?? this.height, devicePixelRatio);
  }

  setSizes(width: number, height: number, devicePixelRatio?: number) {
    this.setWidths(width, devicePixelRatio);
    this.setHeights(height, devicePixelRatio);
    this.setDprs(devicePixelRatio ? devicePixelRatio : this.dpr);
  }

  /** EMITTERS */

  emitDataChangeEvent(params: CanvasDataChangeParams) {
    this.emit(CanvasEvents.DATA_CHANGE, params);
  }

  emitControllerChangeEvent(params: ControllerChangeParams) {
    this.emit(CanvasEvents.CONTROLLER_EVENT, params);
  }

  emitTimerChangeEvent(params: TimerChangeParams) {
    this.emit(CanvasEvents.TIMER_CHANGE, params);
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
        level: this.level,
        score: this.score,
      })
    );
    this.emitControllerChangeEvent({ data: copiedData });
  }

  emitTimerData() {
    const copiedData = JSON.parse(
      JSON.stringify({
        playTime: this.playTime,
      })
    );
    this.emitTimerChangeEvent({ data: copiedData });
  }

  /** GAME STATES */

  getIsPlaying(): Phase {
    return this.isPlaying;
  }

  setFps(fps: number) {
    this.fps = fps;
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
    this.renderLayer.setLevel(level);
    this.emitControllerData();
  }

  updateScore(word: string): void {
    if (!this.dataLayer.validateWord(word)) return;
    this.score +=
      this.dataLayer
        .getTexts()
        .find((text) => text.textData() === word)
        ?.getScore() ?? 0;
  }

  /**
   * @summary on keyboard event
   */
  removeWord(word: string) {
    this.dataLayer.removeViaInput(word);
    this.updateScore(word);
    this.emitCurrentData();

    this.renderLayer.setTexts(this.dataLayer.getTexts());
  }

  addWord(textProps: Omit<TextProps, "ctx">) {
    this.dataLayer.addWord(textProps);
    this.emitCurrentData();

    this.renderLayer.setTexts(this.dataLayer.getTexts());
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

        this.updateFrame();
        this.renderFrame();
        this.emitTimerData();
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

  updateFrame() {
    const texts = this.dataLayer.getTexts();

    for (const text of texts) {
      const { y } = text.getPosition();

      if (y >= this.height) {
        this.dataLayer.moveWordToFailed(text.textData());
        this.dataLayer.removeViaInput(text.textData());
        const targetTextIndex = texts.indexOf(text);
        texts.splice(targetTextIndex, 1);
      }
    }

    this.renderLayer.update();
  }

  renderFrame() {
    this.renderLayer.render();
  }

  destroy() {}
}

export default Controller;
