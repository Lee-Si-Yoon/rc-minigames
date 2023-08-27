import React, { ChangeEvent, FormEvent, useRef, useState } from "react";

import classes from "./typing-game.module.scss";
import Typing from "../../../views/typing/typing";
import useData from "../../../views/typing/hooks/use-data";
import { Phase, TypingRef } from "../../../views/typing/model";
import useController from "../../../views/typing/hooks/use-controller";
import { combinedArray } from "./mock-data";
import Debugger from "./debugger";
import { greyColorHex } from "../../../utils/colors";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Paths } from "../../../routes/paths";

function TypingGame() {
  /** BACKGROUND */

  React.useLayoutEffect(() => {
    document.body.style.backgroundColor = "black";
  }, []);

  /** GAME */

  const ref = useRef<TypingRef>(null);
  const { addWord, removeWord, data } = useData(ref);
  const { setIsPlaying, setLevel, controllerData, timerData } =
    useController(ref);

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

  React.useEffect(() => {
    if (spawnWords && controllerData.isPlaying === Phase.PLAYING) {
      if (combinedArray.length <= 0) return;
      spawnRef.current = setInterval(() => {
        const index = Math.floor(Math.random() * combinedArray.length);
        const word = combinedArray[index];
        if (word) addWord({ data: word });
        combinedArray.splice(index, 1);
      }, 2000);
    }
    return () => clearInterval(spawnRef.current);
  }, [spawnWords, controllerData.isPlaying]);

  /** DEBUGGER */

  const [debugMode, setDebugMode] = useState<boolean>(true);

  /** VIEWPORT */

  const [height, setHeight] = useState<number>(0);

  React.useEffect(() => {
    const viewportHandler = () => {
      if (window.visualViewport && window.visualViewport.offsetTop >= 0) {
        setHeight(window.visualViewport.height - 40);
      }
    };
    viewportHandler();

    window.visualViewport?.addEventListener("resize", viewportHandler);
    return () =>
      window.visualViewport?.removeEventListener("resize", viewportHandler);
  }, [window.visualViewport]);

  /** TIMER */

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paramMinute = searchParams.get("m");
  const paramSecond = searchParams.get("s");
  const totalTime = (Number(paramMinute) * 60 + Number(paramSecond)) * 100;

  const parseMs = (ms: number) => {
    const totalSeconds = Math.floor(ms / 100);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    console.log(totalSeconds, minutes, seconds);

    return {
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    };
  };

  React.useEffect(() => {
    if (totalTime <= timerData.playTime) {
      setIsPlaying(Phase.END);
      navigate(Paths.gymboxx.timer, { replace: true });
    }
  }, [timerData.playTime, totalTime]);

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
          timerData={timerData}
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
        height={height}
        initData={["엘리코", "오버헤드프레스", "스쿼트", "짐박스"]}
        backgroundComponent={
          <div
            style={{
              backgroundColor: greyColorHex.black,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontSize: "4.25rem",
              fontWeight: 800,
              fontFeatureSettings: "clig 'off', liga 'off'",
            }}
          >
            <span className={classes.Jitter}>
              {parseMs(totalTime - timerData.playTime).minutes}’
              {parseMs(totalTime - timerData.playTime).seconds}’’
            </span>
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
