import { ForwardedRef } from "react";
import { DataProps } from "./layers/model";

type CanvasDataChangeParams = { data: DataProps };

type CanvasDataChangeHandler = (params: CanvasDataChangeParams) => void;

interface TypingProps {
  width: number | string;
  height: number | string;
  ref?: ForwardedRef<TypingRef>;
  initData?: DataProps;
  style?: React.CSSProperties;
  isPlaying?: boolean;
}

interface TypingRef {
  // for useController
  setIsPlaying: () => void;
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

export {
  CanvasDataChangeParams,
  CanvasDataChangeHandler,
  TypingProps,
  TypingRef,
};
