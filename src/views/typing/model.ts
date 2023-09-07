import { ForwardedRef, ReactNode } from "react";
import { DataProps, Words } from "./layers/model";
import { TextProps } from "./text/text";

enum Phase {
  PLAYING = "playing",
  PAUSED = "paused",
  END = "end",
}

enum Level {
  EASY = "easy",
  NORMAL = "normal",
  HARD = "hard",
}

interface TypingProps {
  width: React.CSSProperties["width"];
  height: React.CSSProperties["height"];
  ref?: ForwardedRef<TypingRef>;
  initData?: Words;
  style?: React.CSSProperties;
  fps?: number;
  backgroundComponent?: ReactNode;
}

interface TypingRef {
  // for useController
  setIsPlaying: (phase: Phase) => void;
  setLevel: (level: Level) => void;
  addControllerChangeListener: (listener: ControllerChangeHandler) => void;
  removeControllerChangeListener: (listener: ControllerChangeHandler) => void;
  addTimerChangeListener: (listener: TimerChangeHandler) => void;
  removeTimerChangeListener: (listener: TimerChangeHandler) => void;
  // for useData
  addWord: (textProps: Omit<TextProps, "ctx">) => void;
  removeWord: (word: string) => void;
  addDataChangeListener: (listener: CanvasDataChangeHandler) => void;
  removeDataChangeListener: (listener: CanvasDataChangeHandler) => void;
  // for canvas element event listeners
  addCanvasElementEventListener: (
    type: string,
    listener: EventListenerOrEventListenerObject
  ) => void;
  removeCanvasElementEventListener: (
    type: string,
    listener: EventListenerOrEventListenerObject
  ) => void;
}

type CanvasDataChangeParams = { data: DataProps };
type CanvasDataChangeHandler = (params: CanvasDataChangeParams) => void;

// TODO extract playTime event for performance
type ControllerProps = {
  isPlaying: Phase;
  level: Level;
  score: number;
};
type ControllerChangeParams = { data: ControllerProps };
type ControllerChangeHandler = (params: ControllerChangeParams) => void;

type TimerProps = {
  playTime: number;
};
type TimerChangeParams = { data: TimerProps };
type TimerChangeHandler = (params: TimerChangeParams) => void;

export type {
  CanvasDataChangeParams,
  CanvasDataChangeHandler,
  ControllerProps,
  ControllerChangeParams,
  ControllerChangeHandler,
  TimerProps,
  TimerChangeParams,
  TimerChangeHandler,
  TypingProps,
  TypingRef,
};

export { Phase, Level };
