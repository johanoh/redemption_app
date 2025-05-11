import PropTypes from "prop-types";

function RewardCard({ reward, points, onRedeem, loading }) {
  const disabled = reward.points_cost > points || loading;

  return (
    <li
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
      <button onClick={() => onRedeem(reward.id)} disabled={disabled}>
        {loading ? "Processing..." : "Redeem"}
      </button>
    </li>
  );
}

RewardCard.propTypes = {
  reward: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    points_cost: PropTypes.number.isRequired,
  }).isRequired,
  points: PropTypes.number.isRequired,
  onRedeem: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default RewardCard;
