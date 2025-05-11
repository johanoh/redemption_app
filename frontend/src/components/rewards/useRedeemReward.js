import { useState } from "react";
import { redeemReward } from "@api/redemptions";

export function useRedeemReward(setPoints) {
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleRedeem = async (rewardId) => {
    setError(null);
    setLoadingId(rewardId);
    try {
      const data = await redeemReward(rewardId);
      const newBalance = data?.redemption?.points_balance;
      const reward = data?.redemption?.reward;

      if (typeof newBalance === "number") {
        setPoints(newBalance);
        setSuccessMessage(
          `You successfully redeemed ${reward.title} for ${reward.points_cost} points!`,
        );
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Redemption failed", err);
      setError("Redemption failed.");
    } finally {
      setLoadingId(null);
    }
  };

  return { handleRedeem, loadingId, error, successMessage };
}
