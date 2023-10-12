import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Paths } from '../../../routes/paths';
import LogoBar from '../../../views/logo-bar/logo-bar';
import classes from './timer.module.scss';

function Timer() {
  /** BACKGROUND */
  React.useLayoutEffect(() => {
    document.body.style.backgroundColor = 'black';
  }, []);

  const [minutes, setMinutes] = React.useState<number>(0);
  const [seconds, setSeconds] = React.useState<number>(0);

  const [searchParams] = useSearchParams();
  const paramMinute = searchParams.get('m');
  const paramSecond = searchParams.get('s');

  React.useEffect(() => {
    setMinutes(Number(paramMinute));
    setSeconds(Number(paramSecond));
  }, [paramMinute, paramSecond]);

  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate(`${Paths.gymboxx['typing-game']}?m=${minutes}&s=${seconds}`, {
      replace: true,
    });
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <LogoBar />
      <button className={classes.Button} onClick={handleOnClick}>
        GAME START
      </button>
    </div>
  );
}

Timer.displayName = 'Timer';

export default Timer;
