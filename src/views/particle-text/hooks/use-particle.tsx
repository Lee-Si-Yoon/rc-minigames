import { MutableRefObject, useCallback, useEffect, useState } from "react";
import { ParticleTextRef } from "../model";
import useHandlers from "./use-handlers";
import { ControllerChangeHandler, ControllerProps } from "./model";

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
