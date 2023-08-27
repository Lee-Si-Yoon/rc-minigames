import React, { CSSProperties, useEffect, useRef } from "react";
import { RGB } from "../../utils/colors";

export interface FadingProp {
  texts: string[];
  width: CSSProperties["width"];
  height: CSSProperties["height"];
  textColor?: RGB;
  morphTime?: number;
  cooldownTime?: number;
  fontSize?: CSSProperties["fontSize"];
  fontWeight?: CSSProperties["fontWeight"];
  fontFamily?: CSSProperties["fontFamily"];
  background?: {
    enabled: boolean;
    color?: CSSProperties["backgroundColor"];
  };
  style?: CSSProperties;
}

function Fading(props: FadingProp) {
  const text1Ref = useRef<HTMLSpanElement | null>(null);
  const text2Ref = useRef<HTMLSpanElement | null>(null);
  const radId = useRef<number>();

  const fontStyle: CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    textAlign: "center",
    width: "100%",
    fontSize: props.fontSize || "6rem",
    fontFamily:
      `${props.fontFamily ? `${props.fontFamily},` : ""}` +
      "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,  Cantarell,  sans-serif",
    fontWeight: props.fontWeight || "800",
    userSelect: "none",
  };

  const {
    background = {
      enabled: false,
    },
    textColor = { r: 0, g: 0, b: 0 },
    texts,
    morphTime = 1,
    cooldownTime = 0.25,
  } = props;

  useEffect(() => {
    if (!text1Ref.current || !text2Ref.current) return;

    let textIndex = texts.length - 1;
    let morph = 0;
    let cooldown = cooldownTime;
    let time = new Date();

    text1Ref.current.textContent = texts[textIndex % texts.length];
    text2Ref.current.textContent = texts[(textIndex + 1) % texts.length];

    const setMorph = (fraction: number) => {
      if (!text1Ref.current || !text2Ref.current) return;

      text2Ref.current.style.filter = `blur(${Math.min(
        8 / fraction - 8,
        100
      )}px)`;
      text2Ref.current.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const fraction2 = 1 - fraction;
      text1Ref.current.style.filter = `blur(${Math.min(
        8 / fraction2 - 8,
        100
      )}px)`;
      text1Ref.current.style.opacity = `${Math.pow(fraction2, 0.4) * 100}%`;

      text1Ref.current.textContent = texts[textIndex % texts.length];
      text2Ref.current.textContent = texts[(textIndex + 1) % texts.length];
    };

    function doMorph() {
      morph -= cooldown;
      cooldown = 0;

      let fraction = morph / morphTime;

      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }

      setMorph(fraction);
    }

    function doCooldown() {
      if (!text1Ref.current || !text2Ref.current) return;
      morph = 0;

      text2Ref.current.style.filter = "";
      text2Ref.current.style.opacity = "100%";

      text1Ref.current.style.filter = "";
      text1Ref.current.style.opacity = "0%";
    }

    function animate() {
      radId.current = requestAnimationFrame(animate);

      const newTime = new Date();
      const shouldIncrementIndex = cooldown > 0;
      const dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;

      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex++;
        }

        doMorph();
      } else {
        doCooldown();
      }
    }

    animate();

    return () => cancelAnimationFrame(radId.current || 0);
  }, [props]);

  return (
    <div
      style={{
        width: props.width,
        height: props.height,
        outline: "none",
        touchAction: "none",
        position: "relative",
        ...props.style,
      }}
    >
      {background.enabled && (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            backgroundColor: background.color || "black",
          }}
        />
      )}
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          backgroundColor: "transparent",
          filter: "url(#threshold) blur(0.0375rem)",
        }}
      >
        <span ref={text1Ref} style={fontStyle} />
        <span ref={text2Ref} style={fontStyle} />
      </div>
      <svg style={{ width: "0", height: "0", display: "none" }}>
        <defs>
          <filter id="threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values={`1 0 0 0 ${textColor.r ? textColor.r / 255 : 0}
                0 1 0 0 ${textColor.g ? textColor.g / 255 : 0}
                0 0 1 0 ${textColor.b ? textColor.b / 255 : 0}
                0 0 0 255 -100`}
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

Fading.displayName = "Fading";

export default Fading;
