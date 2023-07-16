import { MutableRefObject, useCallback } from "react";
import { CanvasDataChangeHandler, TypingRef } from "../model";

function useHandlers(ref: MutableRefObject<TypingRef | null>) {
  /**
   * @summary CANVAS HANDLERS
   */
  const addCanvasElementEventListener = useCallback(
    (event: string, listener: EventListenerOrEventListenerObject) => {
      ref.current?.addCanvasElementEventListener(event, listener);
      return true;
    },
    [ref]
  );

  const removeCanvasElementEventListener = useCallback(
    (event: string, listener: EventListenerOrEventListenerObject) => {
      ref.current?.removeCanvasElementEventListener(event, listener);
      return true;
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

  return {
    addDataChangeListener,
    removeDataChangeListener,
    addCanvasElementEventListener,
    removeCanvasElementEventListener,
  };
}

export default useHandlers;
