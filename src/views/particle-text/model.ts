import type { ForwardedRef } from 'react';
import type { ControllerChangeHandler } from './hooks/model';

interface ParticleTextProps {
  width: React.CSSProperties['width'];
  height: React.CSSProperties['height'];
  text: string;
  ref?: ForwardedRef<ParticleTextRef>;
  initData?: string;
  style?: React.CSSProperties;
  fps?: number;
}

interface ParticleTextRef {
  removeWord: (word: string) => void;
  addControllerChangeListener: (listener: ControllerChangeHandler) => void;
  removeControllerChangeListener: (listener: ControllerChangeHandler) => void;
}

export type { ParticleTextProps, ParticleTextRef };
