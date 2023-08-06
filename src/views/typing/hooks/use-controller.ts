import { MutableRefObject, useCallback, useEffect, useState } from "react";
import {
  ControllerChangeHandler,
  ControllerProps,
  Level,
  Phase,
  TypingRef,
} from "../model";
import useHandlers from "./use-handlers";

function useController(ref: MutableRefObject<TypingRef | null>) {
  const { addControllerChangeListener, removeControllerChangeListener } =
    useHandlers(ref);
  const [controllerData, setControllerData] = useState<ControllerProps>({
    isPlaying: Phase.END,
    level: Level.EASY,
    playTime: 0,
  });

  useEffect(() => {
    const listener: ControllerChangeHandler = ({ data: controllerData }) => {
      setControllerData(controllerData);
    };
    addControllerChangeListener(listener);

    return () => {
      removeControllerChangeListener(listener);
    };
  }, [addControllerChangeListener, removeControllerChangeListener]);

  const setIsPlaying = useCallback(
    (phase: Phase) => {
      if (!ref || ref.current === null) return;
      ref.current.setIsPlaying(phase);
    },
    [ref]
  );

  const setLevel = useCallback(
    (level: Level) => {
      if (!ref || ref.current === null) return;
      ref.current.setLevel(level);
    },
    [ref]
  );

  return {
    controllerData,
    setIsPlaying,
    setLevel,
  };
}

export default useController;
