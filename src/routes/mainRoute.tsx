import type { RouteObject } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import ParticleGame from '../pages/gymbox/particle-text/particle-text';
import Playground from '../pages/gymbox/playground/playground';
import Score from '../pages/gymbox/score/score';
import Timer from '../pages/gymbox/timer/timer';
import TypingGame from '../pages/gymbox/typing-game/typing-game';
import Root from '../pages/root/root';
import { Paths } from './paths';

const routerConfig: RouteObject[] = [
  {
    path: Paths.default,
    children: [
      {
        index: true,
        Component: Root,
      },
      {
        path: '*',
        Component: Root,
      },
      {
        path: Paths.gymboxx.default,
        children: [
          {
            path: Paths.gymboxx['typing-game'],
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
            path: Paths.gymboxx['particle-text'],
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
