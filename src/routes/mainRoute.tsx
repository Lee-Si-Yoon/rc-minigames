import { RouteObject, createBrowserRouter } from "react-router-dom";
import Root from "../pages/root/root";
import { Paths } from "./paths";
import TypingGame from "../pages/gymbox/typing-game/typing-game";
import Playground from "../pages/gymbox/playground/playground";
import Timer from "../pages/gymbox/timer/timer";
import ParticleGame from "../pages/gymbox/particle-text/particle-text";
import Score from "../pages/gymbox/score/score";

const routerConfig: RouteObject[] = [
  {
    path: Paths.default,
    children: [
      {
        index: true,
        Component: Root,
      },
      {
        path: "*",
        Component: Root,
      },
      {
        path: Paths.gymboxx.default,
        children: [
          {
            path: Paths.gymboxx["typing-game"],
            Component: TypingGame,
          },
          {
            path: Paths.gymboxx.playground,
            Component: Playground,
          },
          {
            path: Paths.gymboxx.timer,
            Component: Timer,
          },
          {
            path: Paths.gymboxx["particle-text"],
            Component: ParticleGame,
          },
          {
            path: Paths.gymboxx.score,
            Component: Score,
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routerConfig);

export default router;
