import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Typing from "../../../views/typing/typing";
import useData from "../../../views/typing/hooks/use-data";
import { Phase, TypingRef } from "../../../views/typing/model";
import useController from "../../../views/typing/hooks/use-controller";
import { combinedArray } from "./mock-data";
import Debugger from "./debugger";

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
    <div style={{ height: "100%", position: "relative" }}>
      <button
        style={{
          all: "unset",
          width: "4rem",
          height: "2.5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: debugMode ? "black" : "white",
          color: debugMode ? "white" : "black",
          border: "0.0625rem solid black",
          position: "absolute",
          zIndex: "99",
          cursor: "pointer",
        }}
        onClick={() => setDebugMode((prev) => !prev)}
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
      />
      <form
        onSubmit={onSubmit}
        style={{
          width: "100%",
          position: "fixed",
          bottom: "0",
        }}
      >
        <input
          type="text"
          autoComplete="off"
          value={inputValue}
          style={{
            all: "unset",
            width: "100%",
            height: "2.5rem",
            borderTop: "0.0625rem solid black",
          }}
          onChange={onChange}
        />
      </form>
    </div>
  );
}

TypingGame.displayName = "TypingGame";

export default TypingGame;
