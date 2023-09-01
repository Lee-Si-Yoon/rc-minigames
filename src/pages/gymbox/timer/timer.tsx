import React from "react";
import classes from "./timer.module.scss";
import ScrollPicker from "../../../views/scroll-picker/scroll-picker";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Paths } from "../../../routes/paths";
import LogoBar from "../../../views/logo-bar/logo-bar";

const Seconds = (length: number) =>
  Array.from({ length }).map((_, i) => Number(i * 10));

const Minutes = (length: number) =>
  Array.from({ length }).map((_, i) => Number(i));

function Timer() {
  /** BACKGROUND */
  React.useLayoutEffect(() => {
    document.body.style.backgroundColor = "black";
  }, []);

  const [minutes, setMinutes] = React.useState<number>(0);
  const [seconds, setSeconds] = React.useState<number>(0);

  const [searchParams] = useSearchParams();
  const paramMinute = searchParams.get("m");
  const paramSecond = searchParams.get("s");

  React.useEffect(() => {
    setMinutes(Number(paramMinute));
    setSeconds(Number(paramSecond));
  }, [paramMinute, paramSecond]);

  const fontStyle = {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "1.5rem",
    fontWeight: "600",
  };

  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate(`${Paths.gymboxx["typing-game"]}?m=${minutes}&s=${seconds}`, {
      replace: true,
    });
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <LogoBar />
      <div
        style={{
          display: "flex",
          width: "calc(100% + 1.5rem)",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          columnGap: "1.25rem",
          marginLeft: "-1.5rem",
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
      <button className={classes.Button} onClick={handleOnClick}>
        GAME START
      </button>
    </div>
  );
}

Timer.displayName = "Timer";

export default Timer;
