import { renderHook } from "@testing-library/react";
import { PointsContext, usePoints } from "./PointsContext";

describe("usePoints", () => {
  it("returns values from PointsContext provider", () => {
    const wrapper = ({ children }) => (
      <PointsContext.Provider value={{ points: 1000, setPoints: jest.fn() }}>
        {children}
      </PointsContext.Provider>
    );

    const { result } = renderHook(() => usePoints(), { wrapper });

    expect(result.current.points).toBe(1000);
    expect(typeof result.current.setPoints).toBe("function");
  });

  it("returns default context values if used outside provider", () => {
    const { result } = renderHook(() => usePoints());

    expect(result.current).toEqual({
      points: null,
      setPoints: expect.any(Function),
    });
  });
});
