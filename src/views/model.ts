import { ForwardedRef } from "react";
import { DataProps } from "./layers/model";

enum Phase {
  PLAYING = "playing",
  PAUSED = "paused",
  END = "end",
}

interface TypingProps {
  width: React.CSSProperties["width"];
  height: React.CSSProperties["height"];
  ref?: ForwardedRef<TypingRef>;
  initData?: DataProps;
  style?: React.CSSProperties;
  fps?: number;
}

interface TypingRef {
  // for useController
  setIsPlaying: (phase: Phase) => void;
  addControllerChangeListener: (listener: ControllerChangeHandler) => void;
  removeControllerChangeListener: (listener: ControllerChangeHandler) => void;
  // for useData
  removeText: (text: string) => void;
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

// TODO specify props for canvas events
type CanvasProps = DataProps;
type CanvasDataChangeParams = { data: CanvasProps };
type CanvasDataChangeHandler = (params: CanvasDataChangeParams) => void;

type ControllerProps = { isPlaying: Phase };
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
