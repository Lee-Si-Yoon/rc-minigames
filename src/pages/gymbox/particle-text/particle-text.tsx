import React, { ChangeEvent, useRef, useState } from "react";
import { ParticleTextRef } from "../../../views/particle-text/model";
import ParticleText from "../../../views/particle-text/particle-text";
import useParticle from "../../../views/particle-text/hooks/use-particle";

function ParticleGame() {
  const ref = useRef<ParticleTextRef>(null);
  const { removeWord } = useParticle(ref);

  const [inputValue, setInputValue] = useState<string>("");
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = e;
    setInputValue(value);
    removeWord(value);
  };
  return (
    <div style={{ height: "100%", position: "relative" }}>
      <ParticleText
        text="왼쪽 원판에는 가족의 고충이"
        ref={ref}
        width="100%"
        height="calc(100% - 1.5rem)"
      />
      <input
        type="text"
        autoComplete="off"
        value={inputValue}
        style={{
          width: "100%",
          height: "1.5rem",
          position: "fixed",
          bottom: "0",
        }}
        onChange={onChange}
      />
    </div>
  );
}

export default ParticleGame;
