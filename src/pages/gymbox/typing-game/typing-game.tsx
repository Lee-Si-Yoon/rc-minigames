import type { ChangeEvent, FormEvent } from 'react';
import React, { useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Paths } from '../../../routes/paths';
import { ChevronIcon, CloseIcon } from '../../../svg';
import {
  greyColorHex,
  greyColorRGB,
  rgaToHex,
  tintColorRGB,
} from '../../../utils/colors';
import { getPoint, lerp } from '../../../utils/math';
import { removeAllWhiteSpaces } from '../../../utils/strip-punctuation';
import type { TextSequence } from '../../../views/intro-text/intro-text';
import IntroText from '../../../views/intro-text/intro-text';
import useController from '../../../views/typing/hooks/use-controller';
import useData from '../../../views/typing/hooks/use-data';
import type { TypingRef } from '../../../views/typing/model';
import { Level, Phase } from '../../../views/typing/model';
import Typing from '../../../views/typing/typing';
import Debugger from './debugger';
import { combinedArray } from './mock-data';
import classes from './typing-game.module.scss';

const gameStartTexts: TextSequence[] = [
  {
    text: 'READY',
    fps: 21,
    duration: 30,
    minSize: 24,
    maxSize: 42,
  },
  {
    text: 'GO!',
    fps: 21,
    duration: 12,
    minSize: 52,
    maxSize: 64,
  },
];

const onGameEndTexts: TextSequence[] = [
  {
    text: 'GAME OVER',
    fps: 21,
    duration: 30,
    minSize: 24,
    maxSize: 42,
  },
];

enum GamePhase {
  BEFORE_START = 'no started yet',
  GAME_PLAYING = 'game is running',
  END = 'game ended, small amount of stall before navigation',
}

function TypingGame() {
  const navigate = useNavigate();
  /** BACKGROUND */
  React.useLayoutEffect(() => {
    if (gameStartTexts.length <= 0 || onGameEndTexts.length <= 0)
      location.reload();
    document.body.style.backgroundColor = 'black';

    return () => {
      document.body.style.backgroundColor = 'initial';
    };
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

    window.visualViewport?.addEventListener('resize', viewportHandler);

    return () => {
      window.visualViewport?.removeEventListener('resize', viewportHandler);
    };
  }, []);

  /** GAME */
  const [gamePhase, setGamePhase] = React.useState<GamePhase>(
    GamePhase.BEFORE_START
  );
  const ref = useRef<TypingRef>(null);
  const { addWord, removeWord, data } = useData(ref);
  const { setIsPlaying, setLevel, controllerData, timerData } =
    useController(ref);

  const [inputValue, setInputValue] = useState<string>('');

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = e;
    setInputValue(value);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    removeWord(inputValue);
    setInputValue('');
  };

  const [spawnWords, setSpawnWords] = useState<boolean>(true);
  const spawnRef = useRef<NodeJS.Timer>();

  React.useEffect(() => {
    if (spawnWords && controllerData.isPlaying === Phase.PLAYING) {
      if (combinedArray.length <= 0) return undefined;
      spawnRef.current = setInterval(() => {
        const index = Math.floor(Math.random() * combinedArray.length);
        const word = removeAllWhiteSpaces(combinedArray[index]);
        if (word)
          addWord({ data: word, special: Math.random() * 10 > 7 ? 2 : 1 });
        combinedArray.splice(index, 1);
      }, 2000);
    }

    return () => {
      clearInterval(spawnRef.current);
    };
  }, [spawnWords, controllerData.isPlaying, addWord]);

  React.useEffect(() => {
    const onGameEnd = () => {
      setIsPlaying(Phase.END);

      setTimeout(() => {
        navigate(`${Paths.gymboxx.score}?score=${controllerData.score}`);
      }, 2000);
    };

    const onGameStart = () => {
      setTimeout(() => {
        setIsPlaying(Phase.PLAYING);
      }, 3500);
    };

    if (gamePhase === GamePhase.GAME_PLAYING) onGameStart();
    if (gamePhase === GamePhase.END) onGameEnd();
  }, [controllerData.score, gamePhase, navigate, setIsPlaying]);

  /** TIMER */
  const [searchParams] = useSearchParams();
  const paramMinute = searchParams.get('m');
  const paramSecond = searchParams.get('s');
  const totalTime = (Number(paramMinute) * 60 + Number(paramSecond)) * 100;

  const parseMs = (ms: number) => {
    const totalSeconds = Math.floor(ms / 100);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return {
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
    };
  };

  React.useEffect(() => {
    console.log(timerData.playTime);
    if (totalTime <= timerData.playTime) setGamePhase(GamePhase.END);
  }, [timerData.playTime, totalTime]);

  const [bgColor, setBgColor] = React.useState<
    React.CSSProperties['backgroundColor']
  >(rgaToHex(greyColorRGB.black));

  React.useEffect(() => {
    const { black } = greyColorRGB;
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
  }, [setLevel, timerData.playTime, totalTime]);

  return (
    <div className={classes.Container}>
      <nav className={classes.Navigation}>
        <button
          className={classes.BackButton}
          onClick={() => {
            return navigate(
              `${Paths.gymboxx.timer}?m=${
                parseMs(totalTime - timerData.playTime).minutes
              }&s=${parseMs(totalTime - timerData.playTime).seconds}`,
              { replace: true }
            );
          }}
        >
          <CloseIcon width={20} height={20} fill={greyColorHex.black} />
        </button>
        <span
          className={[
            timerData.playTime / totalTime > 0.75
              ? timerData.playTime / totalTime > 0.9
                ? classes.Jitter1
                : classes.Jitter2
              : '',
            classes.TimerText,
          ].join(' ')}
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
        onClick={() => {
          return setDebugMode((prev) => {
            return !prev;
          });
        }}
        style={{
          color: debugMode ? '#EA251F' : 'white',
        }}
      >
        debug
      </button>
      <Typing
        ref={ref}
        width={'100%'}
        height={height}
        initData={['엘리코', '오버헤드프레스', '스쿼트', '짐박스']}
        backgroundComponent={
          <div
            className={classes.Mask}
            style={{
              backgroundColor: bgColor,
            }}
          >
            {gamePhase === GamePhase.BEFORE_START && (
              <>
                <div style={{ height }} className={classes.GameStartContainer}>
                  <h2 className={classes.Blink}>GAME START</h2>
                  <span>
                    <b>색깔</b>이 있는 단어는 점수를 더 많이 받을 수 있어요
                  </span>
                </div>
                <div
                  className={[
                    classes.TouchKeyboardContainer,
                    classes.ShiftTopDown,
                  ].join(' ')}
                >
                  <span>아래 입력창을 눌러 키보드를 열어주세요.</span>
                  <ChevronIcon
                    width={20}
                    height={20}
                    fill={greyColorHex.white}
                    style={{ rotate: '270deg' }}
                  />
                </div>
              </>
            )}
            {gamePhase === GamePhase.GAME_PLAYING && (
              <IntroText data={gameStartTexts} width={'100%'} height={height} />
            )}
            {gamePhase === GamePhase.END && (
              <IntroText data={onGameEndTexts} width={'100%'} height={height} />
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
          onFocus={() => {
            return setGamePhase(GamePhase.GAME_PLAYING);
          }}
        />
      </form>
    </div>
  );
}

TypingGame.displayName = 'TypingGame';

export default TypingGame;
