import { MutableRefObject, useCallback } from "react";
import { TypingRef } from "../model";

function useController(ref: MutableRefObject<TypingRef | null>) {
  const setIsPlaying = useCallback(() => {
    if (!ref || ref.current === null) return;
    ref.current.setIsPlaying();
  }, [ref]);

  return {
    setIsPlaying,
  };
}

export default useController;
