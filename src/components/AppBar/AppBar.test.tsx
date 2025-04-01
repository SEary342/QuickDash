import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import AppBar from "./AppBar";
import { mockLinkPages } from "../../tests/MockData";

// Mock Redux hooks
vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}));

describe("AppBar Component", () => {
  beforeEach(() => {
    render(<AppBar linkPages={mockLinkPages} />);
  });

  it("renders the AppBar with QuickDash title", () => {
    expect(screen.getByText("QuickDash")).toBeInTheDocument();
  });

  it("renders the Settings button", () => {
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders the Export button", () => {
    const settingsButton = screen.getByRole("button")
    fireEvent.click(settingsButton)
    expect(screen.getByText("Export")).toBeInTheDocument();
  });

  it("renders the Import button", () => {
    const settingsButton = screen.getByRole("button")
    fireEvent.click(settingsButton)
    expect(screen.getByText("Import")).toBeInTheDocument();
  });

  it("renders the Columns section", () => {
    const settingsButton = screen.getByRole("button")
    fireEvent.click(settingsButton)
    expect(screen.getByText("Columns")).toBeInTheDocument();
  });

  it("renders the App Version text", () => {
    const settingsButton = screen.getByRole("button")
    fireEvent.click(settingsButton)
    expect(screen.getByText(/App Version/i)).toBeInTheDocument();
  });
});
