import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SetPointsForm from "./SetPointsForm";
import { PointsContext } from "./PointsContext";
import * as usersApi from "../api/users";

// mock useUser to return static user ID
jest.mock("./UserContext", () => ({
  useUser: () => ({ id: 1 }),
}));

jest.mock("../api/users");

describe("SetPointsForm", () => {
  const setPoints = jest.fn();

  const renderForm = () =>
    render(
      <PointsContext.Provider value={{ points: 1000, setPoints }}>
        <SetPointsForm />
      </PointsContext.Provider>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("submits valid points and updates context", async () => {
    usersApi.setPoints.mockResolvedValue();
    usersApi.getPoints.mockResolvedValue({ points_balance: 2000 });

    renderForm();

    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "2000" },
    });

    await waitFor(() =>
      fireEvent.click(screen.getByRole("button", { name: /set/i })),
    );

    await waitFor(() => {
      expect(usersApi.setPoints).toHaveBeenCalledWith(1, 2000);
      expect(setPoints).toHaveBeenCalledWith(2000);
    });
  });

  it("shows loading while submitting", async () => {
    let resolve;
    usersApi.setPoints.mockImplementation(
      () => new Promise((r) => (resolve = r)),
    );
    usersApi.getPoints.mockResolvedValue({ points_balance: 3000 });

    renderForm();

    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "3000" },
    });

    fireEvent.click(screen.getByRole("button", { name: /set/i }));

    expect(screen.getByRole("button")).toHaveTextContent(/updating/i);

    await waitFor(() => resolve());
  });

  it("shows error if API call fails", async () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    usersApi.setPoints.mockRejectedValue(new Error("fail"));

    renderForm();

    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "999" },
    });

    await waitFor(() =>
      fireEvent.click(screen.getByRole("button", { name: /set/i })),
    );

    expect(
      await screen.findByText(/failed to update points/i),
    ).toBeInTheDocument();

    consoleError.mockRestore();
  });
  it("shows error if API call fails", async () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    usersApi.setPoints.mockRejectedValue(new Error("fail"));

    renderForm();

    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "999" },
    });

    await waitFor(() =>
      fireEvent.click(screen.getByRole("button", { name: /set/i })),
    );

    expect(
      await screen.findByText(/failed to update points/i),
    ).toBeInTheDocument();

    consoleError.mockRestore();
  });
});
