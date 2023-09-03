import React, { ChangeEvent, FormEvent, useRef, useState } from "react";

import classes from "./typing-game.module.scss";
import Typing from "../../../views/typing/typing";
import useData from "../../../views/typing/hooks/use-data";
import { Level, Phase, TypingRef } from "../../../views/typing/model";
import useController from "../../../views/typing/hooks/use-controller";
import { combinedArray } from "./mock-data";
import Debugger from "./debugger";
import {
  greyColorHex,
  greyColorRGB,
  rgaToHex,
  tintColorRGB,
} from "../../../utils/colors";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Paths } from "../../../routes/paths";
import { lerp, getPoint } from "../../../utils/math";
import { removeAllWhiteSpaces } from "../../../utils/strip-punctuation";
import { ChevronIcon, CloseIcon } from "../../../svg";
import IntroText, { TextSequence } from "../../../views/intro-text/intro-text";

const gameStartTexts: TextSequence[] = [
  {
    text: "READY",
    fps: 21,
    duration: 30,
    minSize: 24,
    maxSize: 42,
  },
  {
    text: "GO!",
    fps: 21,
    duration: 12,
    minSize: 52,
    maxSize: 64,
  },
];

const onGameEndTexts: TextSequence[] = [
  {
    text: "GAME OVER",
    fps: 21,
    duration: 30,
    minSize: 24,
    maxSize: 42,
  },
];

enum GamePhase {
  BEFORE_START = "no started yet",
  GAME_PLAYING = "game is running",
  END = "game ended, small amount of stall before navigation",
}

function TypingGame() {
  /** BACKGROUND */
  React.useLayoutEffect(() => {
    document.body.style.backgroundColor = "black";
  }, []);

  /** DEBUGGER */
  const [debugMode, setDebugMode] = useState<boolean>(false);

  /** VIEWPORT */
  const [height, setHeight] = useState<number>(0);
  React.useEffect(() => {
    const viewportHandler = () => {
      if (window.visualViewport && window.visualViewport.offsetTop >= 0) {
        setHeight(window.visualViewport.height - 40 - 50);
      }
    };
    viewportHandler();

    window.visualViewport?.addEventListener("resize", viewportHandler);
    return () =>
      window.visualViewport?.removeEventListener("resize", viewportHandler);
  }, [window.visualViewport]);

  /** GAME */
  const [gamePhase, setGamePhase] = React.useState<GamePhase>(
    GamePhase.BEFORE_START
  );
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
        const word = removeAllWhiteSpaces(combinedArray[index]);
        if (word)
          addWord({ data: word, special: Math.random() * 10 > 7 ? 2 : 1 });
        combinedArray.splice(index, 1);
      }, 2000);
    }
    return () => clearInterval(spawnRef.current);
  }, [spawnWords, controllerData.isPlaying]);

  React.useEffect(() => {
    const onGameEnd = async () => {
      setIsPlaying(Phase.END);

      await new Promise((r) => setTimeout(r, 2000));

      navigate(`${Paths.gymboxx.score}?score=${controllerData.score}`, {
        replace: true,
      });
    };
    const onGameStart = async () => {
      await new Promise((r) => setTimeout(r, 1500));

      setIsPlaying(Phase.PLAYING);
    };
    if (gamePhase === GamePhase.GAME_PLAYING) onGameStart();
    if (gamePhase === GamePhase.END) onGameEnd();
  }, [gamePhase]);

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
    return {
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    };
  };

  React.useEffect(() => {
    if (totalTime <= timerData.playTime) setGamePhase(GamePhase.END);
  }, [timerData.playTime, totalTime]);

  const [bgColor, setBgColor] = React.useState<
    React.CSSProperties["backgroundColor"]
  >(rgaToHex(greyColorRGB.black));

  React.useEffect(() => {
    const black = greyColorRGB.black;
    const red = tintColorRGB.red_01;
    const ratio = timerData.playTime / totalTime;

    const START = { x: 0.0, y: 0.0 };
    const MID1 = { x: 5.0, y: 0.0 };
    const MID2 = { x: 5.0, y: 0.0 };
    const END = { x: 1.0, y: 1.0 };

    const degreeY = getPoint(START, MID1, MID2, END)(ratio).y;

    const r = lerp(black.r, red.r, degreeY);
    const g = lerp(black.g, red.g, degreeY);
    const b = lerp(black.b, red.b, degreeY);

    const lerpedColor = `rgb(${r},${g},${b})`;

    setBgColor(lerpedColor);
  }, [timerData.playTime, totalTime]);

  React.useEffect(() => {
    timerData.playTime / totalTime > 0.5
      ? timerData.playTime / totalTime > 0.75
        ? setLevel(Level.HARD)
        : setLevel(Level.NORMAL)
      : setLevel(Level.EASY);
  }, [timerData.playTime, totalTime]);

  return (
    <div className={classes.Container}>
      <nav className={classes.Navigation}>
        <button
          className={classes.BackButton}
          onClick={() =>
            navigate(
              `${Paths.gymboxx.timer}?m=${
                parseMs(totalTime - timerData.playTime).minutes
              }&s=${parseMs(totalTime - timerData.playTime).seconds}`,
              { replace: true }
            )
          }
        >
          <CloseIcon width={20} height={20} fill={greyColorHex.black} />
        </button>
        <span
          className={[
            timerData.playTime / totalTime > 0.75
              ? timerData.playTime / totalTime > 0.9
                ? classes.Jitter1
                : classes.Jitter2
              : "",
            classes.TimerText,
          ].join(" ")}
        >
          {parseMs(totalTime - timerData.playTime).minutes}’
          {parseMs(totalTime - timerData.playTime).seconds}’’
        </span>
        <span>{controllerData.score}점</span>
      </nav>
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
      <button
        className={classes.DebugButton}
        onClick={() => setDebugMode((prev) => !prev)}
        style={{
          color: debugMode ? "#EA251F" : "white",
        }}
      >
        debug
      </button>
      <Typing
        ref={ref}
        width={"100%"}
        height={height}
        initData={["엘리코", "오버헤드프레스", "스쿼트", "짐박스"]}
        backgroundComponent={
          <div
            className={classes.Mask}
            style={{
              backgroundColor: bgColor,
            }}
          >
            {gamePhase === GamePhase.BEFORE_START && (
              <>
                <div
                  style={{
                    width: "100%",
                    height,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "white", textAlign: "center" }}>
                    색깔이 있는 단어는 점수를 더 많이 받을 수 있어요
                  </span>
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    width: "100%",
                    paddingBottom: "1rem",
                  }}
                >
                  <span style={{ color: "white", textAlign: "center" }}>
                    아래 입력창을 눌러 키보드를 열어주세요.
                  </span>
                  <ChevronIcon
                    width={20}
                    height={20}
                    fill={greyColorHex.white}
                    style={{ rotate: "270deg" }}
                  />
                </div>
              </>
            )}
            {gamePhase === GamePhase.GAME_PLAYING && (
              <IntroText data={gameStartTexts} width={"100%"} height={height} />
            )}
            {gamePhase === GamePhase.END && (
              <IntroText data={onGameEndTexts} width={"100%"} height={height} />
            )}
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
          onFocus={() => setGamePhase(GamePhase.GAME_PLAYING)}
        />
      </form>
    </div>
  );
}

TypingGame.displayName = "TypingGame";

export default TypingGame;
