import { addMessages, init, locale } from "svelte-i18n";
import en from "./en.json";
import tr from "./tr.json";

addMessages("en", en);

addMessages("tr", tr);

init({ initialLocale: "en" });

export const reset = () => {
  locale.set("en");
};
