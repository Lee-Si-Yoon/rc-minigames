import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import Typing from "../../../views/typing";
import useData from "../../../views/hooks/use-data";
import { TypingRef } from "../../../views/model";
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
    <>
      <i>{JSON.stringify(data)}</i>
      <i>{JSON.stringify(controllerData)}</i>
      <Typing
        ref={ref}
        width="100%"
        height={800}
        initData={{ words: ["all", "this", "boom"] }}
      />
      <button onClick={setIsPlaying}>
        {controllerData?.isPlaying ? "stop" : "play"}
      </button>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          autoComplete="off"
          value={inputValue}
          style={{ width: "100%" }}
          onChange={onChange}
        />
      </form>
    </>
  );
}

TypingGame.displayName = "TypingGame";

export default TypingGame;
