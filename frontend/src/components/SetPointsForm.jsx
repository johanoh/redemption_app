import { useUser } from "./UserContext";
import { usePoints } from "./PointsContext";
import { setPoints as apiSetPoints, getPoints } from "../api/users";
import { useState } from "react";

function SetPointsForm() {
  const { id: userId } = useUser();
  const { setPoints } = usePoints();
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const value = parseInt(input, 10);
    if (isNaN(value) || value < 0) {
      setError("Please enter a valid non-negative number.");
      setLoading(false);
      return;
    }

    try {
      await apiSetPoints(userId, value);
      const data = await getPoints(userId);
      setPoints(data.points_balance);
      setInput("");
    } catch (err) {
      console.error("Failed to set points:", err);
      setError("Failed to update points.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "1.5rem" }}>
      <label>
        Set Points:{" "}
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          min="0"
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Set"}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default SetPointsForm;
