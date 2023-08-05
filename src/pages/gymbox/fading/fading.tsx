import React from "react";
import { useSearchParams } from "react-router-dom";

import Fading, { FadingProp } from "../../../views/fading-text/fading";

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
    width: "100vw",
    height: "100%",
    fontSize: qsFontSize || "6rem",
    textColor: parseRGBColor(qsFontColor) || { R: 255, G: 255, B: 255 },
    background: {
      enabled: Boolean(qsBackground) || true,
      color: qsBackgroundColor || "#171719",
    },
    texts: qsTexts || basicTexts,
  };
  return <Fading {...fadingProps} />;
}

FadingPage.displayName = "FadingPage";

export default FadingPage;
