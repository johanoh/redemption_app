import { fetchJson } from "./client";

export async function redeemReward(rewardId) {
  return fetchJson("/api/v1/redemptions", {
    method: "POST",
    body: JSON.stringify({ reward_id: rewardId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
