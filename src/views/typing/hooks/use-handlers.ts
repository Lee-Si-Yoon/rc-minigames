import { MutableRefObject, useCallback } from "react";
import {
  CanvasDataChangeHandler,
  ControllerChangeHandler,
  TypingRef,
} from "../model";

function useHandlers(ref: MutableRefObject<TypingRef | null>) {
  /**
   * @summary CANVAS HANDLERS
   */
  const addCanvasElementEventListener = useCallback(
    (event: string, listener: EventListenerOrEventListenerObject) => {
      ref.current?.addCanvasElementEventListener(event, listener);
    },
    [ref]
  );

  const removeCanvasElementEventListener = useCallback(
    (event: string, listener: EventListenerOrEventListenerObject) => {
      ref.current?.removeCanvasElementEventListener(event, listener);
    },
    [ref]
  );

  /**
   * @summary DATA HANDLERS
   */
  const addDataChangeListener = useCallback(
    (listener: CanvasDataChangeHandler) => {
      ref.current?.addDataChangeListener(listener);
    },
    [ref]
  );

  const removeDataChangeListener = useCallback(
    (listener: CanvasDataChangeHandler) => {
      ref.current?.removeDataChangeListener(listener);
    },
    [ref]
  );

  /**
   * @summary CONTROLLER HANDLERS
   */
  const addControllerChangeListener = useCallback(
    (listener: ControllerChangeHandler) => {
      ref.current?.addControllerChangeListener(listener);
    },
    [ref]
  );

  const removeControllerChangeListener = useCallback(
    (listener: ControllerChangeHandler) => {
      ref.current?.removeControllerChangeListener(listener);
    },
    [ref]
  );

  return {
    addDataChangeListener,
    removeDataChangeListener,
    addCanvasElementEventListener,
    removeCanvasElementEventListener,
    addControllerChangeListener,
    removeControllerChangeListener,
  };
}

export default useHandlers;
