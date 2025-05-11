
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message || "Something went wrong." };
  }

  componentDidCatch(error, info) {
    console.error("Error caught by ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section style={{ padding: "2rem", color: "red" }}>
          <h2>Something went wrong</h2>
          <p>{this.state.errorMessage}</p>
        </section>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
