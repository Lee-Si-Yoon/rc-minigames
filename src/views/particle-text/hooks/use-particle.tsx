import type { MutableRefObject } from 'react';
import { useCallback, useEffect, useState } from 'react';
import type { ParticleTextRef } from '../model';
import type { ControllerChangeHandler, ControllerProps } from './model';
import useHandlers from './use-handlers';

function useParticle(ref: MutableRefObject<ParticleTextRef | null>) {
  const { addControllerChangeListener, removeControllerChangeListener } =
    useHandlers(ref);
  const [data, setData] = useState<ControllerProps>({
    playTime: 0,
  });

  useEffect(() => {
    const listener: ControllerChangeHandler = ({ data: canvasData }) => {
      setData(canvasData);
    };

    addControllerChangeListener(listener);

    return () => {
      removeControllerChangeListener(listener);
    };
  }, [addControllerChangeListener, removeControllerChangeListener]);

  const removeWord = useCallback(
    (word: string) => {
      if (!ref || ref.current === null) return;
      ref.current.removeWord(word);
    },
    [ref]
  );

  return { data, removeWord };
}

export default useParticle;
