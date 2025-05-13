import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SelectWithLabel } from "./SelectWithLabel";

// Mock dependencies
vi.mock("@mdi/react", () => ({
  default: ({ path }: { path: string }) => <svg data-testid="icon">{path}</svg>,
}));
vi.mock("../types/colors", () => ({
  getColorLookup: (value: string) => ({
    background: `bg-${value}`,
  }),
}));
vi.mock("../types/icons", () => ({
  iconTranslation: {
    apple: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
  },
}));

const options = [
  { value: "apple", label: "Apple", color: true, icon: true },
  { value: "banana", label: "Banana", color: false, icon: false },
];

describe("SelectWithLabel", () => {
  let onChange: (value: string) => void;

  beforeEach(() => {
    onChange = vi.fn();
  });

  it("renders label and default selected text", () => {
    render(
      <SelectWithLabel
        id="fruit"
        value="banana"
        options={options}
        onChange={onChange}
      >
        Fruit
      </SelectWithLabel>
    );

    expect(screen.getByText("Fruit")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
  });

  it("shows dropdown options on click", () => {
    render(
      <SelectWithLabel id="fruit" options={options} onChange={onChange}>
        Fruit
      </SelectWithLabel>
    );

    const trigger = screen.getByText("Select an option");
    fireEvent.click(trigger);

    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
  });

  it("selects an option and calls onChange", () => {
    render(
      <SelectWithLabel id="fruit" options={options} onChange={onChange}>
        Fruit
      </SelectWithLabel>
    );

    fireEvent.click(screen.getByText("Select an option"));
    fireEvent.click(screen.getByText("Apple"));

    expect(onChange).toHaveBeenCalledWith("apple");
  });

  it("displays color and icon if specified", () => {
    render(
      <SelectWithLabel
        id="fruit"
        value="apple"
        options={options}
        onChange={onChange}
      >
        Fruit
      </SelectWithLabel>
    );

    expect(screen.getByText("Apple")).toBeInTheDocument();
  });
});
