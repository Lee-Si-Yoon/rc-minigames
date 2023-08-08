import React, { Dispatch, SetStateAction } from "react";
import { ControllerProps, Level, Phase } from "../../../views/typing/model";
import { DataProps } from "../../../views/typing/layers/model";

interface DebuggerProps {
  data: DataProps;
  controllerData: ControllerProps;
  setIsPlaying: (phase: Phase) => void;
  setLevel: (level: Level) => void;
  spawnWords: boolean;
  setSpawnWords: Dispatch<SetStateAction<boolean>>;
}

function Debugger({
  data,
  controllerData,
  setIsPlaying,
  setLevel,
  spawnWords,
  setSpawnWords,
}: DebuggerProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        rowGap: "0.5rem",
        position: "absolute",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        width: "100%",
        padding: "0.25rem",
        zIndex: "1",
      }}
    >
      <i style={{ fontSize: "0.75rem" }}>{`left words: ${JSON.stringify(
        data.words
      )}`}</i>
      <i style={{ fontSize: "0.75rem" }}>{`failed: ${JSON.stringify(
        data.failed
      )}`}</i>
      <i style={{ fontSize: "0.75rem" }}>{`score: ${JSON.stringify(
        data.score
      )}`}</i>
      <i style={{ fontSize: "0.75rem" }}>{JSON.stringify(controllerData)}</i>
      <div
        style={{
          display: "flex",
          rowGap: "0.25rem",
          height: "1.5rem",
          columnGap: "0.5rem",
        }}
      >
        <label htmlFor="spawn">spawnWords</label>
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
