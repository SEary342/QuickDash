import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { InputWithLabel } from "./InputWithLabel";

describe("<InputWithLabel />", () => {
  const baseProps = {
    id: "username",
    value: "testuser",
    onInputChange: vi.fn(),
    children: "Username",
  };

  it("renders label and input with correct props", () => {
    render(<InputWithLabel {...baseProps} />);
    const label = screen.getByText("Username");
    const input = screen.getByLabelText("Username");

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("testuser");
    expect(input).toHaveAttribute("type", "text");
  });

  it("calls onInputChange when input changes", () => {
    render(<InputWithLabel {...baseProps} />);
    const input = screen.getByLabelText("Username");

    fireEvent.change(input, { target: { value: "newuser" } });

    expect(baseProps.onInputChange).toHaveBeenCalled();
  });

  it("uses custom input type when provided", () => {
    render(<InputWithLabel {...baseProps} type="email" />);
    const input = screen.getByLabelText("Username");
    expect(input).toHaveAttribute("type", "email");
  });

  it("displays default error message when hasError is true", () => {
    render(<InputWithLabel {...baseProps} hasError />);
    expect(screen.getByText("Name is a duplicate")).toBeInTheDocument();
  });

  it("displays custom error message when errorText is a string", () => {
    render(<InputWithLabel {...baseProps} hasError errorText="Custom error" />);
    expect(screen.getByText("Custom error")).toBeInTheDocument();
  });

  it("does not render error if errorText is true and hasError is false", () => {
    render(<InputWithLabel {...baseProps} errorText />);
    expect(screen.queryByText("Name is a duplicate")).not.toBeInTheDocument();
  });

  it("applies custom className to wrapper div", () => {
    render(<InputWithLabel {...baseProps} className="custom-class" />);
    const wrapper = screen.getByText("Username").closest("div");
    expect(wrapper).toHaveClass("custom-class");
  });
});
