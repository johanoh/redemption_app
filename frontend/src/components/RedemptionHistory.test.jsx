import { render, screen, waitFor } from "@testing-library/react";
import RedemptionHistory from "./RedemptionHistory";
import * as usersApi from "../api/users";

// Mock useUser to return a static user
jest.mock("./UserContext", () => ({
  useUser: () => ({ id: 1 }),
}));

// Mock the API module
jest.mock("../api/users");

describe("RedemptionHistory", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders redemption items from API", async () => {
    usersApi.getRedemptionHistory.mockResolvedValue([
      {
        id: 1,
        reward: { title: "Free Coffee", points_cost: 200 },
        redeemed_at: new Date().toISOString(),
      },
      {
        id: 2,
        reward: { title: "Discount Coupon", points_cost: 500 },
        redeemed_at: new Date().toISOString(),
      },
    ]);

    render(<RedemptionHistory />);

    expect(await screen.findByText("Free Coffee")).toBeInTheDocument();
    expect(screen.getByText("Discount Coupon")).toBeInTheDocument();
    expect(screen.getByText(/200 pts/i)).toBeInTheDocument();
    expect(screen.getByText(/500 pts/i)).toBeInTheDocument();
  });

  it("shows an error message when API fails", async () => {
    usersApi.getRedemptionHistory.mockRejectedValue(new Error("API failure"));

    render(<RedemptionHistory />);

    await waitFor(() =>
      expect(
        screen.getByText(/failed to load redemption history/i),
      ).toBeInTheDocument(),
    );
  });
});
