import { fetchJson } from "./client";

export async function redeemReward(rewardId, userId) {
  return fetchJson("/api/v1/redemptions", {
    method: "POST",
    body: JSON.stringify({ reward_id: rewardId, user_id: userId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
