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

  const removeWord = useCallback(
    (word: string) => {
      if (!ref || ref.current === null) return;
      ref.current.removeWord(word);
    },
    [ref]
  );

  const addWord = useCallback(
    (word: string) => {
      if (!ref || ref.current === null) return;
      ref.current.addWord(word);
    },
    [ref]
  );

  return { data, removeWord, addWord };
}

export default useData;
