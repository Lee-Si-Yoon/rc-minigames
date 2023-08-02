import React, { useEffect, useRef } from "react";

import classes from "./fading.module.scss";

const texts = ["나는", "날지", "않아", "그건", "유산소거든"];

function Fading() {
  const text1Ref = useRef<HTMLSpanElement | null>(null);
  const text2Ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!text1Ref.current || !text2Ref.current) return;

    const morphTime = 1;
    const cooldownTime = 0.25;

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
      requestAnimationFrame(animate);

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

    return () => animate();
  }, []);

  return (
    <>
      <div
        style={{
          position: "absolute",
          backgroundColor: "black",
          width: "100vw",
          height: "100%",
        }}
      />
      <div
        className={classes.container}
        style={{ backgroundColor: "transparent" }}
      >
        <span ref={text1Ref} className={classes.text} />
        <span ref={text2Ref} className={classes.text} />
      </div>
      <svg className={classes.filters}>
        <defs>
          <filter id="threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 255
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 255 -155"
            />
          </filter>
        </defs>
      </svg>
    </>
  );
}

Fading.displayName = "Fading";

export default Fading;
