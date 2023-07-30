import { ForwardedRef } from "react";
import { DataProps, Words } from "./layers/model";

enum Phase {
  PLAYING = "playing",
  PAUSED = "paused",
  END = "end",
}

interface TypingProps {
  width: React.CSSProperties["width"];
  height: React.CSSProperties["height"];
  ref?: ForwardedRef<TypingRef>;
  initData?: Words;
  style?: React.CSSProperties;
  fps?: number;
}

interface TypingRef {
  // for useController
  setIsPlaying: (phase: Phase) => void;
  addControllerChangeListener: (listener: ControllerChangeHandler) => void;
  removeControllerChangeListener: (listener: ControllerChangeHandler) => void;
  // for useData
  addWord: (word: string) => void;
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
type ControllerProps = { isPlaying: Phase; playTime: number };
type ControllerChangeParams = { data: ControllerProps };
type ControllerChangeHandler = (params: ControllerChangeParams) => void;

export {
  CanvasDataChangeParams,
  CanvasDataChangeHandler,
  ControllerProps,
  ControllerChangeParams,
  ControllerChangeHandler,
  TypingProps,
  TypingRef,
  Phase,
};
