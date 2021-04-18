import { render, screen } from "@testing-library/svelte";
import AccountActivationPage from "./AccountActivationPage.svelte";
import { setupServer } from "msw/node";
import { rest } from "msw";

const server = setupServer();

beforeAll(() => server.listen());

beforeEach(() => server.resetHandlers());

afterAll(() => server.close());

describe("Account Activation Page", () => {
  let counter = 0;
  beforeEach(() => {
    counter = 0;
    server.use(
      rest.post("/api/1.0/users/token/:token", (req, res, ctx) => {
        if (req.params.token === "5678") {
          return res(
            ctx.status(400),
            ctx.json({ message: "Activation failure" })
          );
        }
        counter += 1;
        return res(ctx.status(200));
      })
    );
  });

  it("displays activation success message when token is correct", async () => {
    render(AccountActivationPage, { token: "1234" });
    const successMessage = await screen.findByText("Account is activated");
    expect(successMessage).toBeInTheDocument();
  });
  it("sends activation request to backend", async () => {
    render(AccountActivationPage, { token: "1234" });
    await screen.findByText("Account is activated");
    expect(counter).toBe(1);
  });
  it("displays activation failure message when token is incorrect", async () => {
    render(AccountActivationPage, { token: "5678" });
    const failMessage = await screen.findByText("Activation failure");
    expect(failMessage).toBeInTheDocument();
  });
  it("displays spinner during activation api call", async () => {
    render(AccountActivationPage, { token: "5678" });
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
  });
});
