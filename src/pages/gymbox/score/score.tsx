import React from "react";
import { useSearchParams } from "react-router-dom";

import classes from "./score.module.scss";
import { Paths } from "../../../routes/paths";
import LogoBar from "../../../views/logo-bar/logo-bar";

function Score() {
  /** BACKGROUND */
  React.useLayoutEffect(() => {
    document.body.style.backgroundColor = "black";
  }, []);

  /** QUERY STRING */
  const [searchParams] = useSearchParams();
  const paramScore = searchParams.get("score");

  return (
    <>
      <LogoBar to={Paths.gymboxx.timer} />
      <div className={classes.Layout}>
        <section className={classes.MyResult}>
          <div>
            <h1 className={[classes.White, classes.Title1].join(" ")}>
              내 결과
            </h1>
          </div>
          <div className={classes.MyResultGrid}>
            <div className={[classes.Card, classes.TopCard].join(" ")}>
              <span className={[classes.Grey04, classes.SubTitle3].join(" ")}>
                이번 스코어
              </span>
              <span className={[classes.White, classes.SubTitle1].join(" ")}>
                +{paramScore}점
              </span>
            </div>
            <div className={[classes.Card, classes.TopCard].join(" ")}>
              <span className={[classes.Grey04, classes.SubTitle3].join(" ")}>
                총 누적 스코어
              </span>
              <span className={[classes.Red02, classes.SubTitle1].join(" ")}>
                -점
              </span>
            </div>

            <div className={[classes.Card, classes.GridRowDouble].join(" ")}>
              <span className={[classes.Grey04, classes.SubTitle3].join(" ")}>
                내 랭킹
              </span>
              <span className={[classes.White, classes.SubTitle1].join(" ")}>
                오늘 기록 없음
              </span>
            </div>
          </div>
        </section>
        <section className={classes.Ranking}>
          <div className={[classes.Col].join(" ")}>
            <h2 className={[classes.White, classes.Title1].join(" ")}>
              랭킹 Top10
            </h2>
            <span className={[classes.Grey04, classes.SubTitle3].join(" ")}>
              10분마다 갱신
            </span>
          </div>
          <ul className={classes.ListContainer}>
            {[1, 2, 3, 4].map((i) => (
              <li className={[classes.List].join(" ")} key={i}>
                <div className={classes.Rank}>
                  <span className={[classes.Red02, classes.Body2].join(" ")}>
                    {i}위
                  </span>
                  <span className={[classes.White, classes.Body2].join(" ")}>
                    1명
                  </span>
                </div>

                <span className={[classes.White, classes.SubTitle1].join(" ")}>
                  10000점
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

Score.displayName = "Score";

export default Score;
