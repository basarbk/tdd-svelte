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
        let page = Number.parseInt(req.url.searchParams.get("page"));
        let size = Number.parseInt(req.url.searchParams.get("size"));
        if (Number.isNaN(page)) {
          page = 0;
        }
        if (Number.isNaN(size)) {
          size = 5;
        }
        return res(ctx.status(200), ctx.json(getPage(page, size)));
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

const getPage = (page, size) => {
  let start = page * size;
  let end = start + size;
  let totalPages = Math.ceil(users.length / size);
  return {
    content: users.slice(start, end),
    page,
    size,
    totalPages,
  };
};

const users = [
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
  {
    id: 4,
    username: "user4",
    email: "user4@mail.com",
    image: null,
  },
  {
    id: 5,
    username: "user5",
    email: "user5@mail.com",
    image: null,
  },
  {
    id: 6,
    username: "user6",
    email: "user6@mail.com",
    image: null,
  },
  {
    id: 7,
    username: "user7",
    email: "user7@mail.com",
    image: null,
  },
];
