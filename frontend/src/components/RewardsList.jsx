import { usePoints } from "./PointsContext";
import { useState, useEffect } from "react";
import { getRewards } from "../api/rewards";
import { redeemReward } from "../api/redemptions";

function RewardsList() {
  const { points, setPoints } = usePoints();
  const [rewards, setRewards] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState("points_asc");

  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const perPage = 10;

  useEffect(() => {
    getRewards({ page, per_page: perPage, sort: sortOption })
      .then((data) => {
        setRewards(data.rewards || []);
        setMeta(data.meta || null);
        setError(null);
      })
      .catch(() => setError("Failed to load rewards."));
  }, [page, sortOption]);

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
        setSuccessMessage(
          `You successfully redeemed ${redeemedTitle} for ${redeemedCost} points!`,
        );
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
            onChange={(e) => {
              setSortOption(e.target.value);
              setPage(1); // reset to page 1 on sort change
            }}
          >
            <option value="points_asc">Cost: Low to High</option>
            <option value="points_desc">Cost: High to Low</option>
            <option value="title_asc">Title: A → Z</option>
            <option value="title_desc">Title: Z → A</option>
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
        {rewards.map((reward) => (
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

      {meta && meta.pages > 1 && (
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <button onClick={() => setPage((p) => p - 1)} disabled={page <= 1}>
            Previous
          </button>
          <span style={{ margin: "0 1rem" }}>
            Page {meta.page} of {meta.pages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= meta.pages}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

export default RewardsList;
