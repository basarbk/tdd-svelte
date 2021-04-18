import { render, screen, waitFor } from "@testing-library/svelte";
import UserList from "./UserList.svelte";
import { setupServer } from "msw/node";
import { rest } from "msw";
import userEvent from "@testing-library/user-event";

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
  it("displays next page link", async () => {
    render(UserList);
    await screen.findByText("user1");
    expect(screen.queryByText("next >")).toBeInTheDocument();
  });
  it("displays next page after clicking next", async () => {
    render(UserList);
    await screen.findByText("user1");
    const nextPage = screen.queryByText("next >");
    await userEvent.click(nextPage);
    const firstUserOnPage2 = await screen.findByText("user4");
    expect(firstUserOnPage2).toBeInTheDocument();
  });
  it("hides next page link at last page", async () => {
    render(UserList);
    await screen.findByText("user1");
    const nextPage = screen.queryByText("next >");
    await userEvent.click(nextPage);
    await screen.findByText("user4");
    await userEvent.click(nextPage);
    await screen.findByText("user7");
    expect(nextPage).not.toBeInTheDocument();
  });
  it("does not display previous page link in the first page", async () => {
    render(UserList);
    await screen.findByText("user1");
    expect(screen.queryByText("< previous")).not.toBeInTheDocument();
  });
  it("displays previous page link in page 2", async () => {
    render(UserList);
    await screen.findByText("user1");
    const nextPage = screen.queryByText("next >");
    await userEvent.click(nextPage);
    await screen.findByText("user4");
    expect(screen.queryByText("< previous")).toBeInTheDocument();
  });
  it("displays previous page after clicking previous page link", async () => {
    render(UserList);
    await screen.findByText("user1");
    const nextPage = screen.queryByText("next >");
    await userEvent.click(nextPage);
    await screen.findByText("user4");
    const previousPage = screen.queryByText("< previous");
    await userEvent.click(previousPage);
    const firstUserOnPage1 = await screen.findByText("user1");
    expect(firstUserOnPage1).toBeInTheDocument();
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
