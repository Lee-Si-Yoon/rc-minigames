import type { RefObject } from 'react';
import { useEffect } from 'react';
import { useRafState } from './use-raf-state';

export interface State {
  x: number;
  y: number;
}

const useScroll = (ref: RefObject<HTMLElement>): State => {
  if (process.env.NODE_ENV === 'development') {
    if (typeof ref !== 'object' || typeof ref.current === 'undefined') {
      console.error('`useScroll` expects a single ref argument.');
    }
  }

  const [state, setState] = useRafState<State>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const outerRef = ref.current;

    const handler = () => {
      if (outerRef) {
        setState({
          x: outerRef.scrollLeft,
          y: outerRef.scrollTop,
        });
      }
    };

    if (outerRef) {
      outerRef.addEventListener('scroll', handler, {
        capture: false,
        passive: true,
      });
    }

    return () => {
      outerRef?.removeEventListener('scroll', handler);
    };
  }, [ref, setState]);

  return state;
};

export { useScroll };
