import React, { useRef } from "react";
import Typing from "../../../views/typing";
import useData from "../../../views/hooks/use-data";
import { TypingRef } from "../../../views/model";
import useController from "../../../views/hooks/use-controller";

function TypingGame() {
  const ref = useRef<TypingRef>(null);
  const { data } = useData(ref);
  const { setIsPlaying, controllerData } = useController(ref);

  return (
    <>
      <i>{JSON.stringify(data)}</i>
      <i>{JSON.stringify(controllerData)}</i>
      <Typing
        ref={ref}
        width="100%"
        height={300}
        initData={{ words: ["all", "this", "boom"] }}
      />
      <button onClick={setIsPlaying}>
        {controllerData?.isPlaying ? "stop" : "play"}
      </button>
    </>
  );
}

TypingGame.displayName = "TypingGame";

export default TypingGame;
