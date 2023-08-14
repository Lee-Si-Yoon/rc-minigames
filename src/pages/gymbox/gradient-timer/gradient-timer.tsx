import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import RadialGradient, {
  RadialGradientProp,
} from "../../../views/radial-gradient/radial-gradient";
import { greyColorRGB, tintColorRGB } from "../../../utils/colors";
import { RGB } from "../../../utils/types";
import Fading, { FadingProp } from "../../../views/fading-text/fading";
import { Paths } from "../../../routes/paths";

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

function GdTimer() {
  document.body.style.backgroundColor = "black";
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const time = searchParams.get("time");
  const timerRef = React.useRef<NodeJS.Timeout>();

  const radialGradientProps: RadialGradientProp = {
    width: "100%",
    height: "100%",
    particleRadius: { min: 100, max: 800 },
    totalParticles: 5,
    colors: basicColors,
  };

  const fadingProps: FadingProp = {
    width: "100%",
    height: "100%",
    fontSize: "12rem",
    fontWeight: 700,
    textColor: { r: 255, g: 255, b: 255 },
    background: {
      enabled: false,
      color: "black",
    },
    texts: Array.from({ length: Number(time) || 0 })
      .map((_, index) => String(index))
      .reverse(),
  };

  React.useEffect(() => {
    if (Number(time) <= 0) return;

    timerRef.current = setTimeout(() => {
      navigate(Paths.gymboxx.timer, { replace: true });
    }, Number(time) * 1000 + 1000);

    return () => clearTimeout(timerRef.current);
  }, [time, timerRef.current]);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <RadialGradient
        {...radialGradientProps}
        style={{ position: "absolute" }}
      />
      <Fading {...fadingProps} style={{ position: "absolute" }} />
    </div>
  );
}

GdTimer.displayName = "GdTimer";

export default GdTimer;
