import { useState, useEffect } from "react";
import { useUser } from "@user/UserContext";
import { PointsContext } from "@user/PointsContext";
import { getPoints } from "@api/users";
import PointsBalance from "@user/PointsBalance";
import RewardsList from "@rewards/List";
import RedemptionHistory from "../components/user/RedemptionHistory";

function HomePage() {
  const { id: userId } = useUser();
  const [points, setPoints] = useState(null);
  const [activeTab, setActiveTab] = useState("rewards");

  useEffect(() => {
    getPoints(userId).then((data) => setPoints(data.points_balance));
  }, [userId]);

  return (
    <div>
      <h1>Rewards Dashboard</h1>

      <PointsContext.Provider value={{ points, setPoints }}>
        {points !== null && <PointsBalance />}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1.5rem",
            margin: "2.5rem 0 2rem",
          }}
        >
          <button
            onClick={() => setActiveTab("rewards")}
            disabled={activeTab === "rewards"}
            style={{
              padding: "0.6rem 1.2rem",
              fontWeight: activeTab === "rewards" ? "bold" : "normal",
              backgroundColor: activeTab === "rewards" ? "#0056b3" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: activeTab === "rewards" ? "default" : "pointer",
              opacity: activeTab === "rewards" ? 0.85 : 1,
            }}
          >
            Available Rewards
          </button>
          <button
            onClick={() => setActiveTab("history")}
            disabled={activeTab === "history"}
            style={{
              padding: "0.6rem 1.2rem",
              fontWeight: activeTab === "history" ? "bold" : "normal",
              backgroundColor: activeTab === "history" ? "#0056b3" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: activeTab === "history" ? "default" : "pointer",
              opacity: activeTab === "history" ? 0.85 : 1,
            }}
          >
            Claimed Rewards
          </button>
        </div>

        {activeTab === "rewards" ? <RewardsList /> : <RedemptionHistory />}
      </PointsContext.Provider>
    </div>
  );
}

export default HomePage;
