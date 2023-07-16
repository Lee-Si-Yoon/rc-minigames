import React from "react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { render } from "@testing-library/react";
import { Paths } from "./paths";

const ROUTES = [[Paths.default]];

describe("Routes", () => {
  test.each(ROUTES)("test %s", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
  });
});
