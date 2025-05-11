import { createContext, useContext } from "react";

export const PointsContext = createContext({
  points: null,
  setPoints: () => {},
});

export function usePoints() {
  return useContext(PointsContext);
}
