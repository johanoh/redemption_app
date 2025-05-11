import { usePoints } from "@user/PointsContext";
import { useState, useEffect } from "react";
import { getRewards } from "@api/rewards";
import { useRedeemReward } from "./useRedeemReward";
import PaginationControls from "@shared/PaginationControls";
import Card from "./Card";

function List() {
  const { points, setPoints } = usePoints();
  const [rewards, setRewards] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState("points_asc");
  const [loadError, setLoadError] = useState(null);
  const perPage = 10;

  useEffect(() => {
    getRewards({ page, per_page: perPage, sort: sortOption })
      .then((data) => {
        setRewards(data.rewards || []);
        setMeta(data.meta || null);
        setLoadError(null);
      })
      .catch(() => setLoadError("Failed to load rewards."));
  }, [page, sortOption]);

  const { handleRedeem, loadingId, error, successMessage } =
    useRedeemReward(setPoints);

  return (
    <section>
      <h2>Available Rewards</h2>
      {successMessage && (
        <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>
      )}
      {loadError && <p className="error">{loadError}</p>}
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        {rewards.map((reward) => (
          <Card
            key={reward.id}
            reward={reward}
            points={points}
            onRedeem={handleRedeem}
            loading={loadingId === reward.id}
          />
        ))}
      </div>

      {meta && meta.pages > 1 && (
        <PaginationControls
          page={page}
          totalPages={meta.pages}
          onPageChange={setPage}
        />
      )}
    </section>
  );
}

export default List;
