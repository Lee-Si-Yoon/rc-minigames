import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Controller from "./control";
import { Coord, RGB } from "../../utils/types";

export interface RadialGradientProp {
  width: CSSProperties["width"];
  height: CSSProperties["height"];
  style?: CSSProperties;
  totalParticles?: number;
  particleRadius?: { min: number; max: number };
  velocity?: Coord;
  colors?: RGB[];
  fps?: number;
}

function RadialGradient(props: RadialGradientProp) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [radiallGradientRef, setRadiallGradientRef] =
    useState<HTMLCanvasElement | null>(null);
  const [radiallGradient, setRadiallGradient] = useState<Controller | null>(
    null
  );

  const getCanvasRef = useCallback((element: HTMLCanvasElement) => {
    if (!element) return;
    element.style["touchAction"] = "none";
    setRadiallGradientRef(element);
  }, []);

  useEffect(() => {
    if (!radiallGradientRef) return;
    const canvas = new Controller({
      canvas: radiallGradientRef,
      totalParticles: props.totalParticles,
      particleRadius: props.particleRadius,
      velocity: props.velocity,
      colors: props.colors,
      fps: props.fps,
    });
    setRadiallGradient(canvas);
  }, [radiallGradientRef]);

  useEffect(() => {
    const onResize = () => {
      if (containerRef.current && radiallGradient) {
        const dpr = window.devicePixelRatio;
        const rect = containerRef.current.getBoundingClientRect();
        radiallGradient.setSize(rect.width, rect.height);
        radiallGradient.scale(dpr, dpr);
        radiallGradient.render();
      }
    };
    onResize();
    window.addEventListener("resize", onResize, false);
    return () => {
      window.removeEventListener("resize", onResize, false);
    };
  }, [radiallGradient]);

  useEffect(() => {
    if (radiallGradient) {
      radiallGradient.playFrames();
    }
  }, [radiallGradient]);

  return (
    <div
      ref={containerRef}
      style={{
        width: props.width,
        height: props.height,
        outline: "none",
        ...props.style,
      }}
    >
      <canvas ref={getCanvasRef} style={{ outline: "none" }} />
    </div>
  );
}

RadialGradient.displayName = "RadialGradient";

export default RadialGradient;
