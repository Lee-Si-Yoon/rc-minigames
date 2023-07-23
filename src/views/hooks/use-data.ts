import { MutableRefObject, useCallback, useEffect, useState } from "react";
import useHandlers from "./use-handlers";
import { CanvasDataChangeHandler, TypingRef } from "../model";
import { DataProps } from "../layers/model";

function useData(ref: MutableRefObject<TypingRef | null>) {
  const { addDataChangeListener, removeDataChangeListener } = useHandlers(ref);
  const [data, setData] = useState<DataProps>({
    words: [],
    score: 0,
    failed: [],
  });

  useEffect(() => {
    const listener: CanvasDataChangeHandler = ({ data: canvasData }) => {
      setData(canvasData);
    };

    addDataChangeListener(listener);

    return () => {
      removeDataChangeListener(listener);
    };
  }, [addDataChangeListener, removeDataChangeListener]);

  const removeText = useCallback(
    (text: string) => {
      if (!ref || ref.current === null) return;
      ref.current.removeText(text);
    },
    [ref]
  );

  return { data, removeText };
}

export default useData;
