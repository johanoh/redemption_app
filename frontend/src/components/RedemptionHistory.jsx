import { useEffect, useState } from "react";
import { useUser } from "./UserContext";
import { getRedemptionHistory } from "../api/users";

function RedemptionHistory() {
  const { id: userId } = useUser();
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getRedemptionHistory(userId)
      .then(setHistory)
      .catch(() => setError("Failed to load redemption history."));
  }, [userId]);

  return (
    <section>
      <h2>Claimed Rewards</h2>
      {error && <p className="error">{error}</p>}
      <ul style={{ paddingLeft: 0 }}>
        {history.map((item) => (
          <li
            key={item.id}
            style={{
              listStyle: "none",
              borderBottom: "1px solid #eee",
              padding: "0.5rem 0",
            }}
          >
            <div style={{ fontWeight: "bold" }}>{item.reward.title}</div>
            <div className="text-muted">
              {item.reward.points_cost} pts —{" "}
              {new Date(item.redeemed_at).toLocaleDateString()}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default RedemptionHistory;
