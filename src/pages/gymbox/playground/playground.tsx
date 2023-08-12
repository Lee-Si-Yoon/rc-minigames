import React, { useState } from "react";

import Fading, { FadingProp } from "../../../views/fading-text/fading";
import RadialGradient, {
  RadialGradientProp,
} from "../../../views/radial-gradient/radial-gradient";
import { greyColorRGB, tintColorRGB } from "../../../utils/colors";
import { RGB } from "../../../utils/types";
import VirtualScroll from "../../../views/virtual-scroll/virtual-scroll";

const basicTexts = ["나는", "날지", "않아", "그건", "유산소거든"];

const basicColors: RGB[] = [
  tintColorRGB.red_01,
  tintColorRGB.red_02,
  tintColorRGB.red_03,
  tintColorRGB.red_04,
  tintColorRGB.red_05,
  greyColorRGB.grey_04,
  greyColorRGB.black,
  greyColorRGB.black,
];

function Playground() {
  const [textValues, setTextValues] = useState<string>(basicTexts.join(","));
  const fadingProps: FadingProp = {
    width: 300,
    height: 300,
    fontSize: "4rem",
    textColor: { r: 255, g: 255, b: 255 },
    background: {
      enabled: true,
      color: "black",
    },
    texts: textValues.split(","),
  };

  const radialGradientProps: RadialGradientProp = {
    width: 300,
    height: 300,
    particleRadius: { min: 10, max: 80 },
    velocity: { x: Math.random() * 1.2, y: Math.random() * 1.2 },
    totalParticles: 5,
    style: {
      backgroundColor: "black",
    },
    colors: basicColors,
  };

  return (
    <div
      style={{
        width: "100vw",
        position: "relative",
        padding: "1rem",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", rowGap: "0.5rem" }}
        >
          <RadialGradient {...radialGradientProps} />
          <i>radial gradient</i>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", rowGap: "0.5rem" }}
        >
          <Fading {...fadingProps} />
          <i>morphing text</i>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="texts">texts</label>
            <input
              value={textValues.replace(/\s+/g, ",")}
              onChange={(e) => setTextValues(e.target.value.replace(" ", ","))}
              type="text"
              name="texts"
              id="texts"
              style={{ width: "18.75rem", height: "2rem" }}
            />
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <RadialGradient
            {...radialGradientProps}
            style={{ position: "absolute", backgroundColor: "black" }}
          />
          <Fading
            {...fadingProps}
            style={{ position: "absolute" }}
            background={{ enabled: true, color: "transparent" }}
          />
        </div>
        <div>
          <VirtualScroll />
        </div>
      </div>
    </div>
  );
}

Playground.displayName = "Playground";

export default Playground;
