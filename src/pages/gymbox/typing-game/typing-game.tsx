import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import Typing from "../../../views/typing";
import useData from "../../../views/hooks/use-data";
import { Phase, TypingRef } from "../../../views/model";
import useController from "../../../views/hooks/use-controller";

function TypingGame() {
  const ref = useRef<TypingRef>(null);
  const { removeText, data } = useData(ref);
  const { setIsPlaying, controllerData } = useController(ref);

  const [inputValue, setInputValue] = useState<string>("");
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = e;
    setInputValue(value);
  };
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    removeText(inputValue);
    setInputValue("");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        rowGap: "0.5rem",
      }}
    >
      <Typing
        ref={ref}
        width="100%"
        height={300}
        initData={{ words: ["all", "this", "boom"] }}
      />
      <i>{JSON.stringify(data)}</i>
      <i>{JSON.stringify(controllerData)}</i>
      <div
        style={{
          display: "flex",
          width: "100%",
          rowGap: "0.25rem",
          height: "1.5rem",
          columnGap: "0.5rem",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() =>
            setIsPlaying(
              controllerData.isPlaying === Phase.PAUSED
                ? Phase.PLAYING
                : Phase.PAUSED
            )
          }
        >
          {controllerData.isPlaying === Phase.PAUSED ? "play" : "pause"}
        </button>
        <button onClick={() => setIsPlaying(Phase.END)}>{Phase.END}</button>
      </div>
      <form onSubmit={onSubmit}>
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

TypingGame.displayName = "TypingGame";

export default TypingGame;
