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

  // TODO setup for mobile
  return (
    <div style={{ height: "100%", position: "relative" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: "0.5rem",
          position: "absolute",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          width: "100%",
          padding: "0.25rem",
          zIndex: "99",
        }}
      >
        <i style={{ fontSize: "0.75rem" }}>{JSON.stringify(data)}</i>
        <i style={{ fontSize: "0.75rem" }}>{JSON.stringify(controllerData)}</i>
        <div
          style={{
            display: "flex",
            rowGap: "0.25rem",
            height: "1.5rem",
            columnGap: "0.5rem",
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
      </div>
      <Typing
        ref={ref}
        width="100%"
        height="calc(100% - 1.5rem)"
        initData={["all", "this", "야호"]}
      />
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

TypingGame.displayName = "TypingGame";

export default TypingGame;
