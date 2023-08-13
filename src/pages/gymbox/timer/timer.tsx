import React from "react";
import classes from "./timer.module.scss";
import ScrollPicker from "../../../views/scroll-picker/scroll-picker";
import { useNavigate } from "react-router-dom";
import { Paths } from "../../../routes/paths";

const Seconds = (length: number) =>
  Array.from({ length }).map((_, i) => Number(i * 10));

const Minutes = (length: number) =>
  Array.from({ length }).map((_, i) => Number(i));

function Timer() {
  document.body.style.backgroundColor = "black";

  const [minutes, setMinutes] = React.useState<number>(0);
  const [seconds, setSeconds] = React.useState<number>(0);

  const fontStyle = {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "2rem",
    fontWeight: "600",
  };

  const navigate = useNavigate();

  const handleOnGDClick = () => {
    navigate(`${Paths.gymboxx.gradientTimer}?time=${minutes * 60 + seconds}`);
  };

  const handleOnClick = () => {
    console.log(minutes * 60 + seconds);
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        rowGap: "5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          columnGap: "1.5rem",
        }}
      >
        <ScrollPicker
          item={Minutes(6)}
          getValue={setMinutes}
          fontStyle={fontStyle}
        />
        <span className={classes.Legend}>분</span>
        <ScrollPicker
          item={Seconds(6)}
          getValue={setSeconds}
          fontStyle={fontStyle}
        />
        <span className={classes.Legend}>초</span>
        <div className={classes.HighLight} />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          bottom: "3.5rem",
          position: "absolute",
          width: "100%",
        }}
      >
        <button
          className={classes.Button}
          style={{ backgroundColor: "#404044" }}
          onClick={handleOnGDClick}
        >
          gdTimer
        </button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          bottom: 0,
          position: "absolute",
          width: "100%",
        }}
      >
        <button className={classes.Button} onClick={handleOnClick}>
          Typing
        </button>
      </div>
    </div>
  );
}

Timer.displayName = "Timer";

export default Timer;
