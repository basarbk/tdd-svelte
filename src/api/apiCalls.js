import axios from "axios";
import { locale } from "svelte-i18n";

locale.subscribe((language) => {
  axios.defaults.headers["Accept-Language"] = language;
});
