import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/svelte";
import LoginPage from "./LoginPage.svelte";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";

const server = setupServer();

beforeAll(() => server.listen());

beforeEach(() => server.resetHandlers());

afterAll(() => server.close());

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
  describe("Interactions", () => {
    let emailInput, passwordInput, button;
    const setup = async () => {
      render(LoginPage);
      emailInput = screen.getByLabelText("E-mail");
      passwordInput = screen.getByLabelText("Password");
      await userEvent.type(emailInput, "user100@mail.com");
      await userEvent.type(passwordInput, "P4ssword");
      button = screen.getByRole("button", { name: "Login" });
    };

    let requestBody;
    let counter = 0;
    beforeEach(() => {
      counter = 0;
      server.use(
        rest.post("/api/1.0/auth", (req, res, ctx) => {
          requestBody = req.body;
          counter += 1;
          return res(
            ctx.status(401),
            ctx.json({ message: "Incorrect credentials" })
          );
        })
      );
    });

    it("enables the button when email and password inputs are filled", async () => {
      await setup();
      expect(button).not.toBeDisabled();
    });

    it("displays spinner after clicking the button", async () => {
      await setup();
      await userEvent.click(button);
      const spinner = screen.getByRole("status");
      expect(spinner).toBeInTheDocument();
    });
    it("hides spinner after api call finishes", async () => {
      await setup();
      await userEvent.click(button);
      const spinner = screen.getByRole("status");
      await waitFor(() => {
        expect(spinner).not.toBeInTheDocument();
      });
    });
    it("sends email and password values to backend after clicking the button", async () => {
      await setup();
      await userEvent.click(button);
      const spinner = screen.getByRole("status");
      await waitForElementToBeRemoved(spinner);
      expect(requestBody).toEqual({
        email: "user100@mail.com",
        password: "P4ssword",
      });
    });
    it("disables the button when there is an api call", async () => {
      await setup();
      await userEvent.click(button);
      await userEvent.click(button);
      const spinner = screen.getByRole("status");
      await waitForElementToBeRemoved(spinner);
      expect(counter).toBe(1);
    });
    it("displays authentication fail message", async () => {
      await setup();
      await userEvent.click(button);
      const errorMessage = await screen.findByText("Incorrect credentials");
      expect(errorMessage).toBeInTheDocument();
    });
    it("clears authentication fail message when email field is changed", async () => {
      await setup();
      await userEvent.click(button);
      const errorMessage = await screen.findByText("Incorrect credentials");
      await userEvent.type(emailInput, "new@mail.com");
      expect(errorMessage).not.toBeInTheDocument();
    });
    it("clears authentication fail message when password field is changed", async () => {
      await setup();
      await userEvent.click(button);
      const errorMessage = await screen.findByText("Incorrect credentials");
      await userEvent.type(passwordInput, "newP4ssword");
      expect(errorMessage).not.toBeInTheDocument();
    });
  });
});
