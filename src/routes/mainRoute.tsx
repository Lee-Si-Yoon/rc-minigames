import React from "react";

import { RouteObject, createBrowserRouter } from "react-router-dom";
import Root from "../pages/root/root";
import { Paths } from "./paths";
import TypingGame from "../pages/gymbox/typing-game/typing-game";

const routerConfig: RouteObject[] = [
  {
    path: Paths.default,
    children: [
      {
        index: true,
        element: <Root />,
      },
      {
        path: "*",
        element: <Root />,
      },
      {
        path: Paths.gymbox.default,
        children: [
          {
            path: Paths.gymbox["typing-game"],
            element: <TypingGame />,
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routerConfig);

export default router;
