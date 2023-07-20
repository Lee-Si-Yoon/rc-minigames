import { ForwardedRef } from "react";
import { DataProps } from "./layers/model";

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
  setIsPlaying: () => void;
  addControllerChangeListener: (listener: ControllerChangeHandler) => void;
  removeControllerChangeListener: (listener: ControllerChangeHandler) => void;
  // for useData
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

type ControllerProps = { isPlaying: boolean };
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
};
