import { render, screen, waitFor } from "@testing-library/svelte";
import UserPage from "./UserPage.svelte";
import { setupServer } from "msw/node";
import { rest } from "msw";

const server = setupServer();

beforeAll(() => server.listen());

beforeEach(() => server.resetHandlers());

afterAll(() => server.close());

describe("User Page", () => {
  beforeEach(() => {
    server.use(
      rest.get("/api/1.0/users/:id", (req, res, ctx) => {
        if (req.params.id === "1") {
          return res(
            ctx.status(200),
            ctx.json({
              id: 1,
              username: "user1",
              email: "user1@mail.com",
              image: null,
            })
          );
        } else {
          return res(
            ctx.status(404),
            ctx.json({
              message: "User not found",
            })
          );
        }
      })
    );
  });

  it("displays user name on page when user is found", async () => {
    render(UserPage, { id: 1 });
    await waitFor(() => {
      expect(screen.queryByText("user1")).toBeInTheDocument();
    });
  });
  it("displays spinner while the api call is in progress", () => {
    render(UserPage, { id: 1 });
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
  });
  it("displays error message received from backend when the user not found", async () => {
    render(UserPage, { id: 100 });
    await waitFor(() => {
      expect(screen.queryByText("User not found")).toBeInTheDocument();
    });
  });
});
