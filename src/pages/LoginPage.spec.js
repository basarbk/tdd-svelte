import { render, screen } from "@testing-library/svelte";
import LoginPage from "./LoginPage.svelte";

describe("Login Page", () => {
  describe("Layout", () => {
    it("has Login header", () => {
      render(LoginPage);
      expect(
        screen.getByRole("heading", { name: "Login" })
      ).toBeInTheDocument();
    });
    it("has email input", () => {
      render(LoginPage);
      const input = screen.getByLabelText("E-mail");
      expect(input).toBeInTheDocument();
    });
    it("has password input", () => {
      render(LoginPage);
      const input = screen.getByLabelText("Password");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password input", () => {
      render(LoginPage);
      const input = screen.getByLabelText("Password");
      expect(input.type).toBe("password");
    });
    it("has Sign Up button", () => {
      render(LoginPage);
      const button = screen.getByRole("button", { name: "Login" });
      expect(button).toBeInTheDocument();
    });
    it("disables the button initially", () => {
      render(LoginPage);
      const button = screen.getByRole("button", { name: "Login" });
      expect(button).toBeDisabled();
    });
  });
});
