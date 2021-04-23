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
import LanguageSelector from "../components/LanguageSelector.svelte";
import en from "../locale/en.json";
import tr from "../locale/tr.json";
import storage from "../store/storage";

const server = setupServer();

beforeAll(() => server.listen());

beforeEach(() => server.resetHandlers());

afterAll(() => server.close());

const loginSuccess = rest.post("/api/1.0/auth", (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({
      id: 5,
      username: "user5",
      image: null,
      token: "abcdefgh",
    })
  );
});

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
    it("stores id, username and image in storage", async () => {
      server.use(loginSuccess);
      await setup();
      await userEvent.click(button);
      const spinner = screen.queryByRole("status");
      await waitForElementToBeRemoved(spinner);
      const storedState = storage.getItem("auth");
      const keyList = Object.keys(storedState);
      expect(keyList.includes("id")).toBeTruthy();
      expect(keyList.includes("username")).toBeTruthy();
      expect(keyList.includes("image")).toBeTruthy();
    });
    it("stores authorization header value in storage", async () => {
      server.use(loginSuccess);
      await setup();
      await userEvent.click(button);
      const spinner = screen.queryByRole("status");
      await waitForElementToBeRemoved(spinner);
      const storedState = storage.getItem("auth");
      expect(storedState.header).toBe("Bearer abcdefgh");
    });
  });

  describe("Internationalization", () => {
    let turkishToggle, englishToggle;
    const setup = () => {
      render(LoginPage);
      render(LanguageSelector);
      turkishToggle = screen.getByTitle("Türkçe");
      englishToggle = screen.getByTitle("English");
    };

    afterEach(() => {
      document.body.innerHTML = "";
    });

    beforeEach(() => {
      server.use(
        rest.post("/api/1.0/auth", (req, res, ctx) => {
          const language = req.headers.get("Accept-Language") || "en";
          return res(
            ctx.status(401),
            ctx.json({
              message:
                language === "en"
                  ? "Incorrect credentials"
                  : "Kullanıcı bilgileri hatalı",
            })
          );
        })
      );
    });

    it("initially displays all texts in english", () => {
      setup();
      expect(
        screen.queryByRole("heading", { name: en.login })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: en.login })
      ).toBeInTheDocument();
      expect(screen.queryByLabelText(en.email)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.password)).toBeInTheDocument();
    });
    it("displays all texts in turkish after changing language", async () => {
      setup();
      await userEvent.click(turkishToggle);
      expect(
        screen.queryByRole("heading", { name: tr.login })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: tr.login })
      ).toBeInTheDocument();
      expect(screen.queryByLabelText(tr.email)).toBeInTheDocument();
      expect(screen.queryByLabelText(tr.password)).toBeInTheDocument();
    });
    it("returns authentication fail message in turkish", async () => {
      setup();
      await userEvent.click(turkishToggle);
      const emailInput = screen.queryByLabelText(tr.email);
      const passwordInput = screen.queryByLabelText(tr.password);
      const button = screen.queryByRole("button", { name: tr.login });
      await userEvent.type(emailInput, "user100@mail.com");
      await userEvent.type(passwordInput, "P4ssword");
      await userEvent.click(button);
      const errorMessage = await screen.findByText(
        "Kullanıcı bilgileri hatalı"
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
