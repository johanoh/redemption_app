import { fetchJson } from "./client";

export async function getPoints(userId) {
  return fetchJson(`/api/v1/users/${userId}/points`);
}

export async function setPoints(userId, points) {
  return fetchJson(`/api/v1/users/${userId}/points`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ points_balance: points }),
  });
}

export async function getRedemptionHistory(userId, { page = 1, per_page = 10 } = {}) {
  const query = new URLSearchParams({ page, per_page }).toString();
  return fetchJson(`/api/v1/users/${userId}/redemptions?${query}`);
}
