import EventDispatcher from '../../utils/eventDispatcher';
import { CanvasEvents } from './events';
import type { ControllerChangeParams } from './hooks/model';
import BackgroundLayer from './layers/background-layer';
import InteractionLayer from './layers/interaction-layer';
import ParticleTextLayer from './layers/particle-text-layer';
import PlainTextLayer from './layers/plain-text-layer';

interface ControllerConstructor {
  backgroundLayer: HTMLCanvasElement;
  interactionLayer: HTMLCanvasElement;
  plainTextLayer: HTMLCanvasElement;
  particleTextLayer: HTMLCanvasElement;
  text: string;
}

class Controller extends EventDispatcher {
  private width: number = 0;

  private height: number = 0;

  private dpr: number = 1;
  // private element: HTMLCanvasElement;

  private backgroundLayer: BackgroundLayer;

  private interactionLayer: InteractionLayer;

  private plainTextLayer: PlainTextLayer;

  private particleTextLayer: ParticleTextLayer;

  private timeStamp: number = 0;

  private playTime: number = 0;

  private fps: number = 60;

  private interval: number = 1000 / this.fps;

  private rafId: number = 0;

  constructor({
    interactionLayer,
    backgroundLayer,
    plainTextLayer,
    particleTextLayer,
    text,
  }: ControllerConstructor) {
    super();

    this.backgroundLayer = new BackgroundLayer({
      canvas: backgroundLayer,
    });
    this.interactionLayer = new InteractionLayer({
      canvas: interactionLayer,
    });
    this.plainTextLayer = new PlainTextLayer({
      canvas: plainTextLayer,
      text,
    });
    this.particleTextLayer = new ParticleTextLayer({
      canvas: particleTextLayer,
      text,
    });

    this.initialize();
  }

  initialize() {
    this.emit = this.emit.bind(this);
  }

  setFps(fps: number) {
    this.fps = fps;
  }

  setScales(x: number, y: number) {
    this.backgroundLayer.scale(x, y);
    this.interactionLayer.scale(x, y);
    this.plainTextLayer.scale(x, y);
    this.particleTextLayer.scale(x, y);
  }

  setDprs(dpr: number) {
    this.dpr = dpr;
    this.backgroundLayer.setDpr(dpr);
    this.interactionLayer.setDpr(dpr);
    this.plainTextLayer.setDpr(dpr);
    this.particleTextLayer.setDpr(dpr);
  }

  private setWidths(width: number, devicePixelRatio?: number) {
    this.width = width;
    this.backgroundLayer.setWidth(width, devicePixelRatio);
    this.interactionLayer.setWidth(width, devicePixelRatio);
    this.plainTextLayer.setWidth(width, devicePixelRatio);
    this.particleTextLayer.setWidth(width, devicePixelRatio);
  }

  private setHeights(height: number, devicePixelRatio?: number) {
    this.height = height;
    this.backgroundLayer.setHeight(height, devicePixelRatio);
    this.interactionLayer.setHeight(height, devicePixelRatio);
    this.plainTextLayer.setHeight(height, devicePixelRatio);
    this.particleTextLayer.setHeight(height, devicePixelRatio);
  }

  setSizes(width: number, height: number, devicePixelRatio?: number) {
    this.setWidths(width, devicePixelRatio);
    this.setHeights(height, devicePixelRatio);
    this.setDprs(devicePixelRatio ? devicePixelRatio : this.dpr);
  }

  setInputValue(value: string) {
    // this.plainTextLayer.setInputValue(value);
    // this.plainTextLayer.render();
    this.particleTextLayer.setInputValue(value);
    // this.particleTextLayer.render();
    // this.particleTextLayer.test();
  }

  emitControllerChangeEvent(params: ControllerChangeParams) {
    this.emit(CanvasEvents.CONTROLLER_EVENT, params);
  }

  emitControllerData() {
    const copiedData = JSON.parse(
      JSON.stringify({
        playTime: this.playTime,
      })
    );
    this.emitControllerChangeEvent({ data: copiedData });
  }

  renderStaticLayers() {
    this.backgroundLayer.render();
    this.particleTextLayer.render();
    // this.plainTextLayer.render();
    // this.particleTextLayer.test();
  }

  render() {
    this.backgroundLayer.render();
    this.interactionLayer.render();
  }

  destroy() {}
}

export default Controller;
