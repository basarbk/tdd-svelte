import { render, screen, waitFor } from "@testing-library/svelte";
import UserList from "./UserList.svelte";
import { setupServer } from "msw/node";
import { rest } from "msw";

const server = setupServer();

beforeAll(() => server.listen());

beforeEach(() => server.resetHandlers());

afterAll(() => server.close());

describe("User List", () => {
  beforeEach(() => {
    server.use(
      rest.get("/api/1.0/users", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(page1));
      })
    );
  });

  it("displays three users in list", async () => {
    render(UserList);
    await waitFor(() => {
      const userList = screen.queryAllByText(/user/);
      expect(userList.length).toBe(3);
    });
  });
});

const page1 = {
  content: [
    {
      id: 1,
      username: "user1",
      email: "user1@mail.com",
      image: null,
    },
    {
      id: 2,
      username: "user2",
      email: "user2@mail.com",
      image: null,
    },
    {
      id: 3,
      username: "user3",
      email: "user3@mail.com",
      image: null,
    },
  ],
  page: 0,
  size: 3,
  totalPages: 9,
};
