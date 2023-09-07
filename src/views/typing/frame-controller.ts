import { Phase } from "./model";

abstract class FrameController {
  public isPlaying: Phase = Phase.PAUSED;

  public playTime: number = 0;
  public timeStamp: number = 0;
  public rafId: number = 0;
  public interval: number = 1000 / 60;

  setFps(fps: number) {
    this.interval = 1000 / fps;
  }

  getIsPlaying(): Phase {
    return this.isPlaying;
  }

  protected abstract play(): void;
}

export default FrameController;
