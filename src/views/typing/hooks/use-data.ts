import type { MutableRefObject } from 'react';
import { useCallback, useEffect, useState } from 'react';
import type { DataProps } from '../layers/model';
import type { CanvasDataChangeHandler, TypingRef } from '../model';
import type { TextProps } from '../text/text';
import useHandlers from './use-handlers';

function useData(ref: MutableRefObject<TypingRef | null>) {
  const { addDataChangeListener, removeDataChangeListener } = useHandlers(ref);
  const [data, setData] = useState<DataProps>({
    words: [],
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
    (textProps: Omit<TextProps, 'ctx'>) => {
      if (!ref || ref.current === null) return;
      ref.current.addWord(textProps);
    },
    [ref]
  );

  return { data, removeWord, addWord };
}

export default useData;
