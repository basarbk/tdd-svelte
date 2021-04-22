import { writable } from "svelte/store";
import storage from "./storage";

const loadStateFromStorage = () => {
  return storage.getItem("auth") || { isLoggedIn: false };
};

export const auth = writable(loadStateFromStorage());

auth.subscribe((authState) => {
  storage.setItem("auth", authState);
});

export const resetAuthState = () => {
  auth.set(loadStateFromStorage());
};
