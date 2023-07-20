import { MutableRefObject, useCallback, useEffect, useState } from "react";
import { ControllerChangeHandler, ControllerProps, TypingRef } from "../model";
import useHandlers from "./use-handlers";

function useController(ref: MutableRefObject<TypingRef | null>) {
  const { addControllerChangeListener, removeControllerChangeListener } =
    useHandlers(ref);
  const [controllerData, setControllerData] = useState<ControllerProps>({
    isPlaying: false,
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

  const setIsPlaying = useCallback(() => {
    if (!ref || ref.current === null) return;
    ref.current.setIsPlaying();
  }, [ref]);

  return {
    controllerData,
    setIsPlaying,
  };
}

export default useController;
