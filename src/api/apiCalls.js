import axios from "axios";
import { locale } from "svelte-i18n";

locale.subscribe((language) => {
  axios.defaults.headers["Accept-Language"] = language;
});

export const signup = (body) => {
  return axios.post("/api/1.0/users", body);
};

export const activate = (token) => {
  return axios.post("/api/1.0/users/token/" + token);
};

export const loadUsers = (page) => {
  return axios.get("/api/1.0/users", { params: { page, size: 3 } });
};

export const getUserById = (id) => {
  return axios.get("/api/1.0/users/" + id);
};
