import { useEffect } from "react";

function App() {
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/up`)
      .then(res => res.text())
      .then(data => {
        console.log("Backend response:", data);
      })
      .catch(err => {
        console.error("Failed to connect to backend:", err);
      });
  }, []);

  return (
    <div>
      <h1>Rewards App</h1>
      <p>Check the browser console for backend connectivity.</p>
    </div>
  );
}

export default App;
