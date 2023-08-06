import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Typing from "../../../views/typing/typing";
import useData from "../../../views/typing/hooks/use-data";
import { Level, Phase, TypingRef } from "../../../views/typing/model";
import useController from "../../../views/typing/hooks/use-controller";

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

  const [spawnWords, setSpawnWords] = useState<boolean>(false);
  const spawnRef = useRef<NodeJS.Timer>();

  useEffect(() => {
    if (spawnWords && controllerData.isPlaying === Phase.PLAYING) {
      spawnRef.current = setInterval(async () => {
        const res = await fetch("https://random-data-api.com/api/v2/beers");
        const jsonData = await res.json();
        const word = String(jsonData.name).slice(
          0,
          Math.ceil(Math.random() * 6) || 1
        );
        addWord(word);
      }, 2000);
    }
    return () => clearInterval(spawnRef.current);
  }, [spawnWords, controllerData.isPlaying]);

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
        <i style={{ fontSize: "0.75rem" }}>{`left words: ${JSON.stringify(
          data.words
        )}`}</i>
        <i style={{ fontSize: "0.75rem" }}>{`failed: ${JSON.stringify(
          data.failed
        )}`}</i>
        <i style={{ fontSize: "0.75rem" }}>{`score: ${JSON.stringify(
          data.score
        )}`}</i>
        <i style={{ fontSize: "0.75rem" }}>{JSON.stringify(controllerData)}</i>
        <div
          style={{
            display: "flex",
            rowGap: "0.25rem",
            height: "1.5rem",
            columnGap: "0.5rem",
          }}
        >
          <label htmlFor="spawn">spawnWords</label>
          <input
            onChange={() => setSpawnWords((prevState) => !prevState)}
            type="checkbox"
            id="spawn"
            checked={spawnWords}
          />
          <select onChange={(e) => setLevel(e.target.value as Level)}>
            {Object.values(Level).map((level) => (
              <option key={level}>{level}</option>
            ))}
          </select>
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
        initData={["운동했니?", "OHP", "스콰뜨", "짐박스", "gymbox", "asri"]}
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
