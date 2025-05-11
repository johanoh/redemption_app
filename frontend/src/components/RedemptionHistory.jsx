import { useEffect, useState } from "react";
import { useUser } from "./UserContext";
import { getRedemptionHistory } from "../api/users";

function RedemptionHistory() {
  const { id: userId } = useUser();
  const [history, setHistory] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  const perPage = 10;

  useEffect(() => {
    getRedemptionHistory(userId, { page, per_page: perPage })
      .then((data) => {
        setHistory(data.redemptions);
        setMeta(data.meta);
        setError(null);
      })
      .catch(() => setError("Failed to load redemption history."));
  }, [userId, page]);

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
              {new Date(item.redeemed_at || item.created_at).toLocaleDateString()}
            </div>
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

export default RedemptionHistory;
