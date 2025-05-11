// src/api/rewards.js
import { fetchJson } from "./client";

export async function getRewards({ page = 1, per_page = 10, sort = "" } = {}) {
  const query = new URLSearchParams({
    page,
    per_page,
    sort,
  }).toString();

  return fetchJson(`/api/v1/rewards?${query}`);
}
