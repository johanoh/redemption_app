import { fetchJson } from "./client";

export async function getRewards() {
  return fetchJson("/api/v1/rewards");
}
