import { UserContext } from "./components/UserContext";
import HomePage from "./pages/HomePage";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const user = { id: 1 };

  return (
    <ErrorBoundary>
      <UserContext.Provider value={user}>
        <main>
          <HomePage />
        </main>
      </UserContext.Provider>
    </ErrorBoundary>
  );
}

export default App;
