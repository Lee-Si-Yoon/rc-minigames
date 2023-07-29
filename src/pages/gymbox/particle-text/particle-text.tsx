import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
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
  };
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    removeWord(inputValue);
    setInputValue("");
  };
  return (
    <div style={{ height: "100%", position: "relative" }}>
      <ParticleText ref={ref} width="100%" height="calc(100% - 1.5rem)" />
      <form
        onSubmit={onSubmit}
        style={{ width: "100%", position: "fixed", bottom: "0" }}
      >
        <input
          type="text"
          autoComplete="off"
          value={inputValue}
          style={{ width: "100%", height: "1.5rem" }}
          onChange={onChange}
        />
      </form>
    </div>
  );
}

export default ParticleGame;
