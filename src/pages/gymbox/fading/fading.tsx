import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Fading, { FadingProp } from "../../../views/fading-text/fading";
import RadiallGradient from "./radiall-gradient";

const basicTexts = ["나는", "날지", "않아", "그건", "유산소거든"];

interface RGBColor {
  R: number;
  G: number;
  B: number;
}

function FadingPage() {
  /**
   * @queryStrings
   * @texts 나는,날지,않아
   * @fontColor rgb(201, 5, 0)
   * @fontSize CSSProperties["fontSize"]
   * @background true | false
   * @backgroundColor rgba(23, 23, 25, 1)
   * @example
   * ?texts=일어나,하체,해야지&fontSize=10rem&fontColor=rgb(201,5,0)&background=true&backgroundColor=rgb(23,23,25)
   */
  const [searchParams] = useSearchParams();
  const qsTexts = searchParams.get("texts")?.split(",");
  const qsFontColor = searchParams.get("fontColor");
  const qsFontSize = searchParams.get("fontSize");
  const qsBackground = searchParams.get("background");
  const qsBackgroundColor = searchParams.get("backgroundColor");

  function parseRGBColor(rgbString: string | null): RGBColor | null {
    const regex = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;
    const match = rgbString?.match(regex);

    if (match) {
      const R = parseInt(match[1]);
      const G = parseInt(match[2]);
      const B = parseInt(match[3]);

      return { R, G, B };
    }

    return null;
  }

  const fadingProps: FadingProp = {
    width: "100%",
    height: "100%",
    fontSize: qsFontSize || "6rem",
    textColor: parseRGBColor(qsFontColor) || { R: 255, G: 255, B: 255 },
    background: {
      enabled: Boolean(qsBackground) || true,
      color: qsBackgroundColor || "tranparent",
    },
    texts: qsTexts || basicTexts,
    style: {
      position: "absolute",
    },
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [radiallGradientRef, setRadiallGradientRef] =
    useState<HTMLCanvasElement | null>(null);
  const [radiallGradient, setRadiallGradient] =
    useState<RadiallGradient | null>(null);

  const getCanvasRef = useCallback((element: HTMLCanvasElement) => {
    if (!element) return;
    element.style["touchAction"] = "none";
    setRadiallGradientRef(element);
  }, []);

  useEffect(() => {
    if (!radiallGradientRef) return;
    const canvas = new RadiallGradient({
      canvas: radiallGradientRef,
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
        radiallGradient.playFrames();
      }
    };
    onResize();
    window.addEventListener("resize", onResize, false);
    return () => {
      window.removeEventListener("resize", onResize, false);
    };
  }, [radiallGradient]);

  return (
    <div style={{ width: "100vw", height: "100%", position: "relative" }}>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          outline: "none",
          position: "absolute",
        }}
      >
        <canvas ref={getCanvasRef} style={{ position: "absolute" }} />
      </div>
      <Fading {...fadingProps} />
    </div>
  );
}

FadingPage.displayName = "FadingPage";

export default FadingPage;
