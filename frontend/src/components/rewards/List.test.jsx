import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import List from "./List";
import { PointsContext } from "@user/PointsContext";
import * as rewardsApi from "@api/rewards";
import * as redemptionsApi from "@api/redemptions";

jest.mock("@api/rewards");
jest.mock("@api/redemptions");

const mockRewards = [
  { id: 1, title: "Free Coffee", points_cost: 200 },
  { id: 2, title: "Gold Mug", points_cost: 1500 },
];

function renderWithPoints(points = 1000, setPoints = jest.fn()) {
  return render(
    <PointsContext.Provider value={{ points, setPoints }}>
      <List />
    </PointsContext.Provider>,
  );
}

describe("List", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders rewards and disables unaffordable ones", async () => {
    rewardsApi.getRewards.mockResolvedValue({
      rewards: mockRewards,
      meta: { page: 1, pages: 1 },
    });

    renderWithPoints(300);

    expect(await screen.findByText("Free Coffee")).toBeInTheDocument();
    expect(screen.getByText("Gold Mug")).toBeInTheDocument();

    const buttons = await screen.findAllByRole("button", { name: /redeem/i });
    expect(buttons[0]).toBeEnabled(); // Free Coffee (200 pts)
    expect(buttons[1]).toBeDisabled(); // Gold Mug (1500 pts)
  });

  it("shows success message after redemption", async () => {
    rewardsApi.getRewards.mockResolvedValue({
      rewards: mockRewards,
      meta: { page: 1, pages: 1 },
    });

    redemptionsApi.redeemReward.mockResolvedValue({
      redemption: {
        points_balance: 800,
        reward: { title: "Free Coffee", points_cost: 200 },
      },
    });

    renderWithPoints(1000);

    const redeemButtons = await screen.findAllByRole("button", {
      name: /redeem/i,
    });
    const redeemButton = redeemButtons.find((btn) => !btn.disabled);
    fireEvent.click(redeemButton);

    await waitFor(() =>
      expect(
        screen.getByText(/you successfully redeemed Free Coffee/i),
      ).toBeInTheDocument(),
    );
  });

  it("shows an error if loading rewards fails", async () => {
    rewardsApi.getRewards.mockRejectedValue(new Error("bad request"));
    renderWithPoints(1000);

    await waitFor(() =>
      expect(screen.getByText(/failed to load rewards/i)).toBeInTheDocument(),
    );
  });

  it("sorts rewards by cost ascending", async () => {
    rewardsApi.getRewards.mockImplementation(({ sort }) => {
      if (sort === "points_asc") {
        return Promise.resolve({
          rewards: [
            { id: 2, title: "Item B", points_cost: 200 },
            { id: 1, title: "Item A", points_cost: 500 },
          ],
          meta: { page: 1, pages: 1 },
        });
      }
      return Promise.resolve({
        rewards: [
          { id: 1, title: "Item A", points_cost: 500 },
          { id: 2, title: "Item B", points_cost: 200 },
        ],
        meta: { page: 1, pages: 1 },
      });
    });

    renderWithPoints(1000);
    await screen.findByText("Item A"); // wait for initial render

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "points_asc" } });

    await waitFor(() => {
      const listItems = screen
        .getAllByRole("listitem")
        .map((li) => li.textContent);
      expect(listItems[0]).toContain("Item B");
      expect(listItems[1]).toContain("Item A");
    });
  });

  it("disables the button while redeeming", async () => {
    rewardsApi.getRewards.mockResolvedValue({
      rewards: mockRewards,
      meta: { page: 1, pages: 1 },
    });

    let resolveRedeem;
    redemptionsApi.redeemReward.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRedeem = resolve;
        }),
    );

    renderWithPoints(1000);
    const redeemButtons = await screen.findAllByRole("button", {
      name: /redeem/i,
    });
    const redeemButton = redeemButtons.find((btn) => !btn.disabled);
    fireEvent.click(redeemButton);

    expect(redeemButton).toBeDisabled();

    resolveRedeem({
      redemption: {
        points_balance: 800,
        reward: { title: "Free Coffee", points_cost: 200 },
      },
    });

    await waitFor(() =>
      expect(
        screen.getByText(/successfully redeemed Free Coffee/i),
      ).toBeInTheDocument(),
    );
  });

  it("calls setPoints with new balance after redeeming", async () => {
    const setPoints = jest.fn();

    rewardsApi.getRewards.mockResolvedValue({
      rewards: mockRewards,
      meta: { page: 1, pages: 1 },
    });

    redemptionsApi.redeemReward.mockResolvedValue({
      redemption: {
        points_balance: 750,
        reward: { title: "Free Coffee", points_cost: 250 },
      },
    });

    renderWithPoints(1000, setPoints);

    const redeemButtons = await screen.findAllByRole("button", {
      name: /redeem/i,
    });
    const redeemButton = redeemButtons.find((btn) => !btn.disabled);
    fireEvent.click(redeemButton);

    await waitFor(() => {
      expect(setPoints).toHaveBeenCalledWith(750);
    });
  });

  it("renders no rewards when list is empty", async () => {
    rewardsApi.getRewards.mockResolvedValue({
      rewards: [],
      meta: { page: 1, pages: 1 },
    });

    renderWithPoints(1000);

    await screen.findByText("Available Rewards");
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });
});
