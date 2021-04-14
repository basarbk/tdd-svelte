import SignUpPage from "./SignUpPage.svelte";
import LanguageSelector from "../components/LanguageSelector.svelte";
import { render, screen, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
import en from "../locale/en.json";
import tr from "../locale/tr.json";

const server = setupServer();

beforeAll(() => server.listen());

beforeEach(() => server.resetHandlers());

afterAll(() => server.close());

describe("Sign Up Page", () => {
  describe("Layout", () => {
    it("has Sign Up header", () => {
      render(SignUpPage);
      const header = screen.getByRole("heading", { name: "Sign Up" });
      expect(header).toBeInTheDocument();
    });
    it("has username input", () => {
      render(SignUpPage);
      const input = screen.getByLabelText("Username");
      expect(input).toBeInTheDocument();
    });
    it("has email input", () => {
      render(SignUpPage);
      const input = screen.getByLabelText("E-mail");
      expect(input).toBeInTheDocument();
    });
    it("has password input", () => {
      render(SignUpPage);
      const input = screen.getByLabelText("Password");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password input", () => {
      render(SignUpPage);
      const input = screen.getByLabelText("Password");
      expect(input.type).toBe("password");
    });
    it("has password repeat input", () => {
      render(SignUpPage);
      const input = screen.getByLabelText("Password Repeat");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password repeat input", () => {
      render(SignUpPage);
      const input = screen.getByLabelText("Password Repeat");
      expect(input.type).toBe("password");
    });
    it("has Sign Up button", () => {
      render(SignUpPage);
      const button = screen.getByRole("button", { name: "Sign Up" });
      expect(button).toBeInTheDocument();
    });
    it("disables the button initially", () => {
      render(SignUpPage);
      const button = screen.getByRole("button", { name: "Sign Up" });
      expect(button).toBeDisabled();
    });
  });
  describe("Interactions", () => {
    let requestBody;
    let counter = 0;
    beforeEach(() => {
      counter = 0;
      server.use(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          requestBody = req.body;
          counter += 1;
          return res(ctx.status(200));
        })
      );
    });

    let button, usernameInput, passwordInput, passwordRepeatInput;
    const setup = async () => {
      render(SignUpPage);
      usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("E-mail");
      passwordInput = screen.getByLabelText("Password");
      passwordRepeatInput = screen.getByLabelText("Password Repeat");
      button = screen.getByRole("button", { name: "Sign Up" });
      await userEvent.type(usernameInput, "user1");
      await userEvent.type(emailInput, "user1@mail.com");
      await userEvent.type(passwordInput, "P4ssword");
      await userEvent.type(passwordRepeatInput, "P4ssword");
    };

    it("enables the button when the password and password repeat fields have same value", async () => {
      await setup();
      expect(button).toBeEnabled();
    });
    it("sends username, email and password to backend after clicking the button", async () => {
      await setup();

      await userEvent.click(button);

      await screen.findByText(
        "Please check your e-mail to activate your account"
      );

      expect(requestBody).toEqual({
        username: "user1",
        email: "user1@mail.com",
        password: "P4ssword",
      });
    });
    it("disables button when there is an ongoing api call", async () => {
      await setup();

      await userEvent.click(button);
      await userEvent.click(button);

      await screen.findByText(
        "Please check your e-mail to activate your account"
      );

      expect(counter).toBe(1);
    });
    it("displays spinner while the api request in progress", async () => {
      await setup();

      await userEvent.click(button);

      const spinner = screen.getByRole("status");
      expect(spinner).toBeInTheDocument();
    });
    it("does not display spinner when there is no api request", async () => {
      await setup();
      const spinner = screen.queryByRole("status");
      expect(spinner).not.toBeInTheDocument();
    });
    it("displays account activation information after successful sign up request", async () => {
      await setup();

      await userEvent.click(button);

      const text = await screen.findByText(
        "Please check your e-mail to activate your account"
      );
      expect(text).toBeInTheDocument();
    });
    it("does not display account activation message before sign up request", async () => {
      await setup();
      const text = screen.queryByText(
        "Please check your e-mail to activate your account"
      );
      expect(text).not.toBeInTheDocument();
    });
    it("does not display account activation information after failing sign up request", async () => {
      server.use(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(400));
        })
      );
      await setup();

      await userEvent.click(button);

      const text = screen.queryByText(
        "Please check your e-mail to activate your account"
      );
      expect(text).not.toBeInTheDocument();
    });
    it("hides sign up form after successful sign up request", async () => {
      await setup();

      const form = screen.getByTestId("form-sign-up");
      await userEvent.click(button);
      await waitFor(() => {
        expect(form).not.toBeInTheDocument();
      });
    });

    const generateValidationError = (field, message) => {
      return rest.post("/api/1.0/users", (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            validationErrors: {
              [field]: message,
            },
          })
        );
      });
    };

    it.each`
      field         | message
      ${"username"} | ${"Username cannot be null"}
      ${"email"}    | ${"E-mail cannot be null"}
      ${"password"} | ${"Password cannot be null"}
    `("displays $message for $field field", async ({ field, message }) => {
      server.use(generateValidationError(field, message));
      await setup();

      await userEvent.click(button);

      const validationError = await screen.findByText(message);
      expect(validationError).toBeInTheDocument();
    });
    it("hides spinner after response received", async () => {
      server.use(
        generateValidationError("username", "Username cannot be null")
      );
      await setup();

      await userEvent.click(button);

      await screen.findByText("Username cannot be null");
      const spinner = screen.queryByRole("status");
      expect(spinner).not.toBeInTheDocument();
    });
    it("enables the button after response received", async () => {
      server.use(
        generateValidationError("username", "Username cannot be null")
      );
      await setup();

      await userEvent.click(button);

      await screen.findByText("Username cannot be null");

      expect(button).toBeEnabled();
    });
    it("displays mismatch message for password repeat input", async () => {
      await setup();
      await userEvent.type(passwordInput, "N3wP4ss");
      await userEvent.type(passwordRepeatInput, "anotherPa4s");
      const validationError = await screen.findByText("Password mismatch");
      expect(validationError).toBeInTheDocument();
    });
    it("does not display mismatch message initially", () => {
      render(SignUpPage);
      const validationError = screen.queryByText("Password mismatch");
      expect(validationError).not.toBeInTheDocument();
    });
    it.each`
      field         | message                      | label
      ${"username"} | ${"Username cannot be null"} | ${"Username"}
      ${"email"}    | ${"E-mail cannot be null"}   | ${"E-mail"}
      ${"password"} | ${"Password cannot be null"} | ${"Password"}
    `(
      "clears validation error after $field field is updated",
      async ({ field, message, label }) => {
        server.use(generateValidationError(field, message));
        await setup();

        await userEvent.click(button);

        const validationError = await screen.findByText(message);
        const input = screen.getByLabelText(label);
        await userEvent.type(input, "updated");
        expect(validationError).not.toBeInTheDocument();
      }
    );
  });
  describe("Internationalization", () => {
    beforeEach(() => {
      server.use(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          const language = req.headers.get("Accept-Language") || "en";
          return res(
            ctx.status(400),
            ctx.json({
              validationErrors: {
                username:
                  language === "en"
                    ? "Username cannot be null"
                    : "Kullanıcı adı boş olamaz",
              },
            })
          );
        })
      );
    });

    let turkishToggle, englishToggle, password, passwordRepeat, button;
    const setup = () => {
      render(SignUpPage);
      render(LanguageSelector);
      turkishToggle = screen.getByTitle("Türkçe");
      englishToggle = screen.getByTitle("English");
      password = screen.queryByLabelText(en.password);
      passwordRepeat = screen.queryByLabelText(en.passwordRepeat);
      button = screen.getByRole("button", { name: en.signUp });
    };

    afterEach(() => {
      document.body.innerHTML = "";
    });
    it("initially displays all texts in English", () => {
      render(SignUpPage);
      expect(
        screen.queryByRole("heading", { name: en.signUp })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: en.signUp })
      ).toBeInTheDocument();
      expect(screen.queryByLabelText(en.username)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.email)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.password)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.passwordRepeat)).toBeInTheDocument();
    });
    it("displays all text in Turkish after toggling the language", async () => {
      setup();
      await userEvent.click(turkishToggle);
      expect(
        screen.queryByRole("heading", { name: tr.signUp })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: tr.signUp })
      ).toBeInTheDocument();
      expect(screen.queryByLabelText(tr.username)).toBeInTheDocument();
      expect(screen.queryByLabelText(tr.email)).toBeInTheDocument();
      expect(screen.queryByLabelText(tr.password)).toBeInTheDocument();
      expect(screen.queryByLabelText(tr.passwordRepeat)).toBeInTheDocument();
    });
    it("displays all texts in English after toggling back from Turkish", async () => {
      setup();
      await userEvent.click(turkishToggle);
      await userEvent.click(englishToggle);
      expect(
        screen.queryByRole("heading", { name: en.signUp })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: en.signUp })
      ).toBeInTheDocument();
      expect(screen.queryByLabelText(en.username)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.email)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.password)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.passwordRepeat)).toBeInTheDocument();
    });
    it("displays password mismatch validation in Turkish", async () => {
      setup();
      await userEvent.click(turkishToggle);
      await userEvent.type(password, "n3WPass");
      const validationMessageInTurkish = screen.queryByText(
        tr.passwordMismatchValidation
      );
      expect(validationMessageInTurkish).toBeInTheDocument();
    });
    it("returns validation messages in english initially", async () => {
      setup();
      await userEvent.type(password, "P4ssword");
      await userEvent.type(passwordRepeat, "P4ssword");
      await userEvent.click(button);
      const validationError = await screen.findByText(
        "Username cannot be null"
      );
      expect(validationError).toBeInTheDocument();
    });
    it("returns validation messages in Turkish after that language is selected", async () => {
      setup();
      await userEvent.click(turkishToggle);
      await userEvent.type(password, "P4ssword");
      await userEvent.type(passwordRepeat, "P4ssword");
      await userEvent.click(button);
      const validationError = await screen.findByText(
        "Kullanıcı adı boş olamaz"
      );
      expect(validationError).toBeInTheDocument();
    });
    it("returns validation messages in English after toggling back from Turkish", async () => {
      setup();
      await userEvent.click(turkishToggle);
      await userEvent.click(englishToggle);
      await userEvent.type(password, "P4ssword");
      await userEvent.type(passwordRepeat, "P4ssword");
      await userEvent.click(button);
      const validationError = await screen.findByText(
        "Username cannot be null"
      );
      expect(validationError).toBeInTheDocument();
    });
  });
});
