import { MutableRefObject, useCallback } from "react";
import { ParticleTextRef } from "../model";
import { ControllerChangeHandler } from "./model";

function useHandlers(ref: MutableRefObject<ParticleTextRef | null>) {
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

  return { addControllerChangeListener, removeControllerChangeListener };
}

export default useHandlers;
