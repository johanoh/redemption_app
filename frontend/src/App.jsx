import { UserContext } from "./components/UserContext";
import HomePage from "./pages/HomePage";

function App() {
  const user = { id: 1 };

  return (
    <UserContext.Provider value={user}>
      <main>
        <HomePage />
      </main>
    </UserContext.Provider>
  );
}

export default App;
