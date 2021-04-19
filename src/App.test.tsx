import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { xOffsets } from "./animation";

test("renders learn react link", () => {
  render(<App />);
  const startButton = screen.getByText(/Start Game/i);
  expect(startButton).toBeInTheDocument();
});

test("calculate correct offsets for animation", () => {
  const cases: Record<string, Array<number>> = {
    "3": [29, 119, 209],
    "4": [0, 82, 164, 245],
    "5": [0, 65, 131, 196, 262],
  };
  Object.keys(cases).map(count => {
    expect(xOffsets(375 - 48, 90, +count).map(x => Math.round(x))).toEqual(cases[count]);
  })
});
