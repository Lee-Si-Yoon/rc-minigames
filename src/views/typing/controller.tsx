import { EventDispatcherWithRAF } from "../../utils/eventDispatcher";
import RenderLayer from "./layers/render-layer";
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
import LevelState from "./level-state";

interface ControllerConstructor {
  renderLayer: HTMLCanvasElement;
  initData?: Words;
}

class Controller extends EventDispatcherWithRAF {
  private width: number = 0;
  private height: number = 0;
  private dpr: number = 1;
  private element: HTMLCanvasElement;

  private renderLayer: RenderLayer;

  private levelState: LevelState;

  private score: number = 0;

  constructor({ renderLayer, initData }: ControllerConstructor) {
    super();

    this.levelState = new LevelState();

    this.renderLayer = new RenderLayer({
      canvas: renderLayer,
      initData: initData,
      levelState: this.levelState,
    });
    this.element = renderLayer;

    this.initialize();
  }

  private initialize() {
    this.emit = this.emit.bind(this);
  }

  getCanvasElement(): HTMLCanvasElement {
    return this.element;
  }

  scale(x: number, y: number) {
    this.renderLayer.scale(x, y);
  }

  setDprs(dpr: number) {
    this.dpr = dpr;
    this.renderLayer.setDpr(dpr);
  }

  private setWidths(width: number, devicePixelRatio: number) {
    this.width = width;
    this.renderLayer.setWidth(width, devicePixelRatio);
  }

  private setHeights(height: number, devicePixelRatio: number) {
    this.height = height;
    this.renderLayer.setHeight(height, devicePixelRatio);
  }

  setSizes(width: number, height: number, devicePixelRatio: number) {
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
      data: this.renderLayer.getCopiedData(),
    });
  }

  emitControllerData() {
    const copiedData = JSON.parse(
      JSON.stringify({
        isPlaying: this.isPlaying,
        level: this.levelState.getLevelName(),
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

  setIsPlaying(phase: Phase) {
    this.isPlaying = phase;

    if (phase === Phase.END) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
      this.playTime = 0;
    } else if (phase === Phase.PAUSED) {
      cancelAnimationFrame(this.rafId);
    } else if (phase === Phase.PLAYING) {
      this.play();
    }

    this.emitControllerData();
  }

  setLevel(level: Level) {
    if (level === Level.HARD) {
      this.levelState.setLevel(this.levelState.Hard);
    } else if (level === Level.NORMAL) {
      this.levelState.setLevel(this.levelState.Normal);
    } else if (level === Level.EASY) {
      this.levelState.setLevel(this.levelState.Easy);
    }

    this.emitControllerData();
  }

  updateScore(word: string): void {
    if (!this.renderLayer.validateWord(word)) return;
    const targetWord = this.renderLayer
      .getTexts()
      .find((text) => text.textData() === word);
    const score = targetWord?.getScore() ?? 0;
    const special = targetWord?.getSpecial() ?? 0;
    this.score += special * score ?? score;
  }

  /**
   * @summary on keyboard event
   */
  removeWord(word: string) {
    this.updateScore(word);
    this.renderLayer.removeViaInput(word);
    this.emitCurrentData();
  }

  addWord(textProps: Omit<TextProps, "ctx">) {
    this.renderLayer.addWord(textProps);
    this.emitCurrentData();
  }

  play(): void {
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
        this.renderLayer.initialize();
      }

      timer += deltaTime;
      this.playTime += 1;
    };

    animate(this.timeStamp);
  }

  updateFrame() {
    const texts = this.renderLayer.getTexts();

    for (const text of texts) {
      const { y } = text.getPosition();

      if (y >= this.height) {
        this.renderLayer.moveWordToFailed(text.textData());
        this.renderLayer.removeViaInput(text.textData());
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
