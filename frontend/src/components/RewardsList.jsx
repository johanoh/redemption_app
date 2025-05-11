import { usePoints } from "./PointsContext";
import { useState, useEffect } from "react";
import { getRewards } from "../api/rewards";
import { redeemReward } from "../api/redemptions";

function RewardsList() {
  const { points, setPoints } = usePoints();
  const [rewards, setRewards] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("default");
  const [successMessage, setSuccessMessage] = useState(null);

  const sortedRewards = [...rewards].sort((a, b) => {
    if (sortOption === "costLow") return a.points_cost - b.points_cost;
    if (sortOption === "costHigh") return b.points_cost - a.points_cost;
    if (sortOption === "titleAZ") return a.title.localeCompare(b.title);
    if (sortOption === "titleZA") return b.title.localeCompare(a.title);
    return 0;
  });

  useEffect(() => {
    getRewards()
      .then(setRewards)
      .catch(() => setError("Failed to load rewards."));
  }, []);

  const handleRedeem = async (rewardId) => {
    setError(null);
    setLoadingId(rewardId);
    try {
      const data = await redeemReward(rewardId);
      const newBalance = data?.redemption?.points_balance;
      const redeemedTitle = data?.redemption?.reward?.title;
      const redeemedCost = data?.redemption?.reward?.points_cost;

      if (typeof newBalance === "number") {
        setPoints(newBalance);
        if (redeemedTitle) {
          setSuccessMessage(
            `You successfully redeemed ${redeemedTitle} for  ${redeemedCost} points!`,
          );
        }
      } else {
        console.warn("Invalid redeem response:", data);
        setError("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Redemption failed", err);
      setError("Redemption failed.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <section>
      <h2>Available Rewards</h2>
      {successMessage && (
        <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>
      )}

      {error && <p className="error">{error}</p>}
      <div style={{ marginBottom: "1rem", textAlign: "right" }}>
        <label>
          Sort by:{" "}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="costLow">Cost: Low to High</option>
            <option value="costHigh">Cost: High to Low</option>
            <option value="titleAZ">Title: A → Z</option>
            <option value="titleZA">Title: Z → A</option>
          </select>
        </label>
      </div>

      <ul
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
          paddingLeft: 0,
        }}
      >
        {sortedRewards.map((reward) => (
          <li
            key={reward.id}
            style={{
              listStyle: "none",
              border: "1px solid #ddd",
              padding: "1rem",
              borderRadius: "8px",
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "0.5rem",
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
              {reward.title}
            </div>
            <div className="text-muted">{reward.points_cost} pts</div>
            <button
              onClick={() => handleRedeem(reward.id)}
              disabled={loadingId === reward.id || reward.points_cost > points}
            >
              {loadingId === reward.id ? "Processing..." : "Redeem"}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default RewardsList;
