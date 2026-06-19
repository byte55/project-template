import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "./page";

describe("LoginPage", () => {
  it("renders the login form by default", () => {
    render(<LoginPage />);
    expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("name@example.com")).toBeInTheDocument();
  });

  it("toggles to the sign-up form", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));
    expect(screen.getByRole("heading", { name: "Sign up" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
  });
});
