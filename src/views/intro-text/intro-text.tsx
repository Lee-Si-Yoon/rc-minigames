import React from "react";
import BaseLayer from "../../utils/base-layer";
import { lerp, getPoint } from "../../utils/math";
export interface TextSequence {
  text: string;
  fps?: number;
  duration?: number;
  minSize?: number;
  maxSize?: number;
}

export interface IntroTextProps {
  data: TextSequence[];
  width: React.CSSProperties["width"];
  height: React.CSSProperties["height"];
  backgroundColor?: React.CSSProperties["color"];
  style?: React.CSSProperties;
}

enum PhaseEvent {
  NO_DATA_LEFT = "data is not left",
}

interface ControllerProps {
  canvas: HTMLCanvasElement;
  data: TextSequence[];
  backgroundColor?: React.CSSProperties["color"];
}

class Controller extends BaseLayer {
  private data: TextSequence[] = [];
  private target: TextSequence = {
    text: "",
    duration: 0,
    fps: 0,
  };

  private text: string = "";
  private duration: number = 0;
  private fps: number = 60;

  private interval: number = 1000 / this.fps;
  private timeStamp: number = 0;
  private rafId: number = 0;
  private playTimeOffset: number = 10;

  constructor({ canvas, data }: ControllerProps) {
    super({ canvas });

    this.data = data;
  }

  initialize() {
    const target = this.data.shift();
    if (!target) {
      cancelAnimationFrame(this.rafId);
      this.element.dispatchEvent(new Event(PhaseEvent.NO_DATA_LEFT));

      return;
    }

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.target = target;
    this.text = target.text;
    this.interval = 1000 / (target.fps ?? 60);
    this.duration = target.duration ?? 0;
  }

  start(): void {
    let timer = 0;
    let lastTime = 0;

    const animate = (timeStamp: number) => {
      this.timeStamp = timeStamp;

      const deltaTime = timeStamp - lastTime;
      lastTime = timeStamp;

      this.rafId = requestAnimationFrame(animate);

      if (timer > this.interval) {
        timer = 0;

        const ctx = this.ctx;

        ctx.save();
        // https://www.youtube.com/watch?v=eI9idPTT0c4&list=PLpPnRKq7eNW16Wq1GQjQjpTo_E0taH0La
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.restore();

        this.render();
      }

      timer += deltaTime;
    };

    animate(this.timeStamp);
  }

  render(): void {
    const ctx = this.ctx;

    ctx.save();
    ctx.fillStyle = `rgba(255, 255, 255, 1)`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const START = { x: 0.0, y: 0.0 };
    const MID1 = { x: 0.25, y: -1.0 };
    const MID2 = { x: 0.75, y: 0.0 };
    const END = { x: 1.0, y: 1.0 };

    const degreeY = getPoint(
      START,
      MID1,
      MID2,
      END
    )(1 - this.duration / this.target.duration!);

    ctx.font = `bold ${lerp(
      this.target.minSize ?? 16,
      this.target.maxSize ?? 24,
      degreeY.y
    )}px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`;
    ctx.fillText(this.text, this.width / 2, this.height / 2);
    ctx.restore();

    if (this.duration < -this.playTimeOffset) this.initialize();

    this.duration -= 1;
  }
}

function IntroText(props: IntroTextProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [controllerRef, setControllerRef] =
    React.useState<HTMLCanvasElement | null>(null);
  const [controller, setController] = React.useState<Controller | null>(null);
  const [isNoDataLeft, setIsNoDataLeft] = React.useState<boolean>(false);

  const getControllerRef = React.useCallback((element: HTMLCanvasElement) => {
    if (!element) return;
    element.style["touchAction"] = "none";
    setControllerRef(element);
  }, []);

  React.useEffect(() => {
    if (!controllerRef) return;
    if (!props.data) setIsNoDataLeft(true);
    const canvas = new Controller({
      canvas: controllerRef,
      data: props.data,
      backgroundColor: props.backgroundColor,
    });
    setController(canvas);
  }, [controllerRef, props.data]);

  React.useEffect(() => {
    const onResize = () => {
      if (!containerRef.current || !controller) return;
      const dpr = window.devicePixelRatio ?? 1;
      const rect = containerRef.current.getBoundingClientRect();
      controller.setSize(rect.width, rect.height, dpr);
      controller.scale(dpr, dpr);
    };

    onResize();
    window.addEventListener("resize", onResize, false);

    return () => window.removeEventListener("resize", onResize, false);
  }, [controller, containerRef.current]);

  React.useEffect(() => {
    if (!controller) return;
    controller.start();

    const element = controller.getElement();
    const onNoDataLeftEvent = () => setIsNoDataLeft(true);
    element.addEventListener(PhaseEvent.NO_DATA_LEFT, onNoDataLeftEvent);

    return () =>
      element.removeEventListener(PhaseEvent.NO_DATA_LEFT, onNoDataLeftEvent);
  }, [controller]);

  if (isNoDataLeft) return null;

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      style={{
        outline: "none",
        width: props.width,
        height: props.height,
        backgroundColor: props.backgroundColor,
        position: "relative",
        ...props.style,
      }}
    >
      <canvas ref={getControllerRef} style={{ position: "absolute" }} />
    </div>
  );
}

IntroText.displayName = "IntroText";

export default IntroText;
