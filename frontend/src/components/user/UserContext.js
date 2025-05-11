import { createContext, useContext } from "react";

// Hardcoded user for demo
const defaultUser = { id: 1 };

export const UserContext = createContext(defaultUser);

export function useUser() {
  return useContext(UserContext);
}
