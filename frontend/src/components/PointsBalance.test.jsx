import { render, screen } from "@testing-library/react";
import { PointsContext } from "./PointsContext";
import PointsBalance from "./PointsBalance";
import React from "react";

function renderWithPointsContext(pointsValue) {
  return render(
    <PointsContext.Provider value={pointsValue}>
      <PointsBalance />
    </PointsContext.Provider>,
  );
}

describe("PointsBalance", () => {
  it("displays loading when points is null", () => {
    renderWithPointsContext({ points: null, setPoints: jest.fn() });
    expect(screen.getByText(/loading points/i)).toBeInTheDocument();
  });

  it("displays the current points balance", () => {
    renderWithPointsContext({ points: 1234, setPoints: jest.fn() });
    expect(screen.getByText(/1234 pts/i)).toBeInTheDocument();
  });

  it("renders SetPointsForm", () => {
    renderWithPointsContext({ points: 500, setPoints: jest.fn() });
    expect(screen.getByLabelText(/set points/i)).toBeInTheDocument();
  });
});
