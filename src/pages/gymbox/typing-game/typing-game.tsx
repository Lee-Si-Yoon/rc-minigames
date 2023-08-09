import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import classes from "./typing-game.module.scss";
import Typing from "../../../views/typing/typing";
import useData from "../../../views/typing/hooks/use-data";
import { Phase, TypingRef } from "../../../views/typing/model";
import useController from "../../../views/typing/hooks/use-controller";
import { combinedArray } from "./mock-data";
import Debugger from "./debugger";
import { greyColorHex } from "../../../utils/colors";

function TypingGame() {
  const ref = useRef<TypingRef>(null);
  const { addWord, removeWord, data } = useData(ref);
  const { setIsPlaying, setLevel, controllerData } = useController(ref);

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

  const [spawnWords, setSpawnWords] = useState<boolean>(true);
  const spawnRef = useRef<NodeJS.Timer>();

  useEffect(() => {
    if (spawnWords && controllerData.isPlaying === Phase.PLAYING) {
      if (combinedArray.length <= 0) return;
      spawnRef.current = setInterval(() => {
        const index = Math.floor(Math.random() * combinedArray.length);
        const word = combinedArray[index];
        addWord({ data: word });
        combinedArray.splice(index, 1);
      }, 2000);
    }
    return () => clearInterval(spawnRef.current);
  }, [spawnWords, controllerData.isPlaying]);

  const [debugMode, setDebugMode] = useState<boolean>(true);

  return (
    <div className={classes.Container}>
      <button
        className={classes.DebugButton}
        onClick={() => setDebugMode((prev) => !prev)}
        style={{
          color: debugMode ? "#EA251F" : "white",
        }}
      >
        debug
      </button>
      {debugMode && (
        <Debugger
          data={data}
          controllerData={controllerData}
          setIsPlaying={setIsPlaying}
          setLevel={setLevel}
          spawnWords={spawnWords}
          setSpawnWords={setSpawnWords}
        />
      )}
      <Typing
        ref={ref}
        width="100%"
        height="calc(100% - 2.5rem)"
        initData={["엘리코", "오버헤드프레스", "스쿼트", "짐박스"]}
        backgroundComponent={
          <div
            style={{
              backgroundColor: greyColorHex.black,
              width: "100%",
              height: "100%",
            }}
          >
            hidsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
          </div>
        }
      />
      <form onSubmit={onSubmit} className={classes.Form}>
        <input
          type="text"
          autoComplete="off"
          placeholder="타자도 손가락 운동이다"
          value={inputValue}
          className={classes.Input}
          onChange={onChange}
        />
      </form>
    </div>
  );
}

TypingGame.displayName = "TypingGame";

export default TypingGame;
