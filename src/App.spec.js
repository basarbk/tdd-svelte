import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import App from "./App.svelte";

describe("Routing", () => {
  const setup = (path) => {
    window.history.pushState({}, "", path);
    render(App);
  };

  it.each`
    path         | pageTestId
    ${"/"}       | ${"home-page"}
    ${"/signup"} | ${"signup-page"}
    ${"/login"}  | ${"login-page"}
    ${"/user/1"} | ${"user-page"}
    ${"/user/2"} | ${"user-page"}
  `("displays $pageTestId when path is $path", ({ path, pageTestId }) => {
    setup(path);
    const page = screen.queryByTestId(pageTestId);
    expect(page).toBeInTheDocument();
  });

  it.each`
    path         | pageTestId
    ${"/"}       | ${"signup-page"}
    ${"/"}       | ${"login-page"}
    ${"/"}       | ${"user-page"}
    ${"/signup"} | ${"home-page"}
    ${"/signup"} | ${"login-page"}
    ${"/signup"} | ${"user-page"}
    ${"/login"}  | ${"home-page"}
    ${"/login"}  | ${"signup-page"}
    ${"/login"}  | ${"user-page"}
    ${"/user/1"} | ${"home-page"}
    ${"/user/1"} | ${"signup-page"}
    ${"/user/1"} | ${"login-page"}
  `(
    "does not display $pageTestId when path is $path",
    ({ path, pageTestId }) => {
      setup(path);
      const page = screen.queryByTestId(pageTestId);
      expect(page).not.toBeInTheDocument();
    }
  );

  it.each`
    path         | queryName
    ${"/"}       | ${"Home"}
    ${"/signup"} | ${"Sign Up"}
    ${"/login"}  | ${"Login"}
  `("has link to $queryName on NavBar", ({ path, queryName }) => {
    setup("/");
    const link = screen.queryByRole("link", { name: queryName });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toBe(path);
  });

  it.each`
    initialPath  | clicking     | visible          | lastUrl
    ${"/"}       | ${"Sign Up"} | ${"signup-page"} | ${"/signup"}
    ${"/signup"} | ${"Home"}    | ${"home-page"}   | ${"/"}
    ${"/"}       | ${"Login"}   | ${"login-page"}  | ${"/login"}
  `(
    "displays $visible after clicking $clicking link",
    async ({ initialPath, clicking, visible, lastUrl }) => {
      setup(initialPath);
      const link = screen.queryByRole("link", { name: clicking });
      await userEvent.click(link);
      const page = screen.queryByTestId(visible);
      expect(page).toBeInTheDocument();
      expect(window.location.pathname).toBe(lastUrl);
    }
  );
});
