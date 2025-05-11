import { usePoints } from "@user/PointsContext";
import SetPointsForm from "@user/SetPointsForm";

function PointsBalance() {
  const { points } = usePoints();

  if (points == null) return <p>Loading points...</p>;

  return (
    <section>
      <h2>Points Balance</h2>
      <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{points} pts</p>
      <SetPointsForm />
    </section>
  );
}

export default PointsBalance;
