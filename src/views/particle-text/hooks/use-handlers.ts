import type { MutableRefObject } from 'react';
import { useCallback } from 'react';
import type { ParticleTextRef } from '../model';
import type { ControllerChangeHandler } from './model';

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
