import HomePage from "./pages/HomePage";
import ErrorBoundary from "./components/ErrorBoundary";
import { UserContext } from "@user/UserContext";

function App() {
  const user = { id: 1 }; //hard coded

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
