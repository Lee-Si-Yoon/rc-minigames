import { MutableRefObject, useEffect, useState } from "react";
import useHandlers from "./use-handlers";
import { DataProps } from "../layers/model";
import { CanvasDataChangeHandler, TypingRef } from "../model";

function useData(ref: MutableRefObject<TypingRef | null>) {
  const { addDataChangeListener, removeDataChangeListener } = useHandlers(ref);
  const [data, setData] = useState<DataProps>({ score: 0 });

  useEffect(() => {
    const listener: CanvasDataChangeHandler = ({ data: canvasData }) => {
      setData(canvasData);
    };

    addDataChangeListener(listener);

    return () => {
      removeDataChangeListener(listener);
    };
  }, [addDataChangeListener, removeDataChangeListener]);

  return { data };
}

export default useData;
