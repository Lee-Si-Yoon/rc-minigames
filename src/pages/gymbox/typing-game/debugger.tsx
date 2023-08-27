import React, { Dispatch, SetStateAction } from "react";

import classes from "./debugger.module.scss";
import {
  ControllerProps,
  Level,
  Phase,
  TimerProps,
} from "../../../views/typing/model";
import { DataProps } from "../../../views/typing/layers/model";

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
          onChange={() => setSpawnWords((prevState) => !prevState)}
          type="checkbox"
          id="spawn"
          checked={spawnWords}
        />
        <select onChange={(e) => setLevel(e.target.value as Level)}>
          {Object.values(Level).map((level) => (
            <option key={level}>{level}</option>
          ))}
        </select>
        <button
          onClick={() =>
            setIsPlaying(
              controllerData.isPlaying === Phase.PAUSED
                ? Phase.PLAYING
                : Phase.PAUSED
            )
          }
        >
          {controllerData.isPlaying === Phase.PAUSED ? "play" : "pause"}
        </button>
        <button onClick={() => setIsPlaying(Phase.END)}>{Phase.END}</button>
      </div>
    </div>
  );
}

Debugger.displayName = "Debugger";

export default Debugger;
