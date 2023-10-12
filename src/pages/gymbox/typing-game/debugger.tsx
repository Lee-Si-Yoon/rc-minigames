import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import type { DataProps } from '../../../views/typing/layers/model';
import type { ControllerProps, TimerProps } from '../../../views/typing/model';
import { Level, Phase } from '../../../views/typing/model';
import classes from './debugger.module.scss';

interface DebuggerProps {
  data: DataProps;
  timerData: TimerProps;
  controllerData: ControllerProps;
  setIsPlaying: (phase: Phase) => void;
  setLevel: (level: Level) => void;
  spawnWords: boolean;
  setSpawnWords: Dispatch<SetStateAction<boolean>>;
}

function Debugger({
  data,
  timerData,
  controllerData,
  setIsPlaying,
  setLevel,
  spawnWords,
  setSpawnWords,
}: DebuggerProps) {
  return (
    <div className={classes.Debugger}>
      <i className={classes.Info}>{`left words: ${JSON.stringify(
        data.words
      )}`}</i>
      <i className={classes.Info}>{`time: ${JSON.stringify(
        timerData.playTime
      )}`}</i>
      <i className={classes.Info}>{`failed: ${JSON.stringify(data.failed)}`}</i>
      <i className={classes.Info}>{JSON.stringify(controllerData)}</i>
      <div className={classes.Controller}>
        <label htmlFor="spawn" className={classes.Info}>
          spawnWords
        </label>
        <input
          onChange={() => {
            return setSpawnWords((prevState) => {
              return !prevState;
            });
          }}
          type="checkbox"
          id="spawn"
          checked={spawnWords}
        />
        <select
          onChange={(e) => {
            return setLevel(e.target.value as Level);
          }}
        >
          {Object.values(Level).map((level) => {
            return <option key={level}>{level}</option>;
          })}
        </select>
        <button
          onClick={() => {
            return setIsPlaying(
              controllerData.isPlaying === Phase.PAUSED
                ? Phase.PLAYING
                : Phase.PAUSED
            );
          }}
        >
          {controllerData.isPlaying === Phase.PAUSED ? 'play' : 'pause'}
        </button>
        <button
          onClick={() => {
            return setIsPlaying(Phase.END);
          }}
        >
          {Phase.END}
        </button>
      </div>
    </div>
  );
}

Debugger.displayName = 'Debugger';

export default Debugger;
