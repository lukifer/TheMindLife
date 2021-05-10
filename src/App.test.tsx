import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { xOffsets } from "./animation";

test("renders app", () => {
  render(<App />);
  const startButton = screen.getByText(/Start Game/i);
  expect(startButton).toBeInTheDocument();
});

test("calculate correct offsets for animation", () => {
  const screenWidth = 375 - 48;
  const itemWidth = 90;
  const cases: Record<string, Array<number>> = {
    "3": [29, 119, 209],
    "4": [0, 82, 164, 245],
    "5": [0, 65, 131, 196, 262],
  };
  Object.keys(cases).map(count => {
    const allItemsWidth = (+count * itemWidth);
    const allItemsGap = Math.max(0, allItemsWidth - screenWidth);
    const itemOffset = allItemsGap / (+count * 2);
    const testOffsets = xOffsets(screenWidth, itemWidth, +count);
    expect(testOffsets.map(x => Math.round(x+itemOffset))).toEqual(cases[count]);
  })
});
