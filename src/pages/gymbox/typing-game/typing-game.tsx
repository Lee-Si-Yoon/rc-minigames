import React, { useRef } from "react";
import Typing from "../../../views/typing";
import useData from "../../../views/hooks/use-data";
import { TypingRef } from "../../../views/model";
import useController from "../../../views/hooks/use-controller";

function TypingGame() {
  const ref = useRef<TypingRef>(null);
  const { data } = useData(ref);
  const { setIsPlaying } = useController(ref);

  return (
    <>
      <i>{JSON.stringify(data)}</i>
      <button onClick={setIsPlaying}>play</button>
      <Typing ref={ref} width={"100%"} height={300} isPlaying />
    </>
  );
}

TypingGame.displayName = "TypingGame";

export default TypingGame;
