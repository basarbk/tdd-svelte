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

export const loadUsers = () => {
  return axios.get("/api/1.0/users", { params: { page: 0, size: 3 } });
};
