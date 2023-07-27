import BackgroundLayer from "./layers/background-layer";
import EventDispatcher from "./utils/eventDispatcher";
import DataLayer from "./layers/data-layer";
import InteractionLayer from "./layers/interaction-layer";
import { CanvasEvents } from "./types";
import { CanvasDataChangeParams, ControllerChangeParams, Phase } from "./model";
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

  private isPlaying: Phase = Phase.END;

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
      })
    );
    this.emitControllerChangeEvent({ data: copiedData });
  }

  setIsPlaying(phase: Phase) {
    this.isPlaying = phase;
    this.backgroundLayer.render();
    this.playFrames(phase);
    this.emitControllerData();
  }

  /**
   * @summary on keyboard event
   */
  removeWord(word: string) {
    this.dataLayer.updateScore(word);
    this.dataLayer.spliceTextByString(word);
    this.renderAll();
    this.emitCurrentData();
  }

  addWord(word: string) {
    this.dataLayer.addWord(word);
    this.renderAll();
    this.emitCurrentData();
  }

  renderAll() {
    this.dataLayer.render();
  }

  playFrames(phase: Phase): void {
    if (phase === Phase.END) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
      this.playTime = 0;

      this.emitCurrentData();
      this.dataLayer.initialize();
    } else if (phase === Phase.PAUSED) {
      cancelAnimationFrame(this.rafId);
    } else if (phase === Phase.PLAYING) {
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

        this.emitControllerData();
      };

      animate(this.timeStamp);
    }
  }

  playGame() {
    this.renderAll();

    const texts = this.dataLayer.getTexts();

    texts.forEach((text) => {
      const self = text;
      const { x: originalX, y: originalY } = self.getVelocity();
      if (
        self.getPosition().x + self.getDimension().width > this.width &&
        originalX > 0
      ) {
        self.setVelocity({ x: -originalX, y: originalY });
      } else if (self.getPosition().x < 0 && originalX < 0) {
        self.setVelocity({
          x: Math.abs(originalX),
          y: originalY,
        });
      }
      const exceptSelf = texts.filter((text) => text !== self);
      exceptSelf.forEach((other) => {
        if (self.getIsCollided(other)) {
          self.setVelocity(self.getVelocityAfterCollision(other));
        }
      });
    });

    const overflowedText = texts.find(
      (text) => text.getPosition().y >= this.height
    );
    if (overflowedText) {
      this.dataLayer.spliceTextByString(overflowedText.getTextData());
      this.dataLayer.moveDataWordToFailed(overflowedText.getTextData());
      this.emitCurrentData();
    }

    texts.forEach((text) => text.updatePositionByVelocity());
  }

  destroy() {
    // remove eventListners
  }
}

export default Controller;
