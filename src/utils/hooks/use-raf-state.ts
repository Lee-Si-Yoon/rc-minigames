import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * @url https://github.com/streamich/react-use/blob/master/src/useRafState.ts
 * @param initialState generic
 * @returns [state, stateSetter]
 */
export function useRafState<S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>] {
  const frame = useRef<number>(0);
  const [state, setState] = useState(initialState);

  const setRafState = useCallback((value: S | ((prevState: S) => S)) => {
    cancelAnimationFrame(frame.current);

    frame.current = requestAnimationFrame(() => setState(value));
  }, []);

  /* cancelAnimationFrame when unmount */
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return [state, setRafState];
}
