import { addMessages, init } from "svelte-i18n";
import en from "./en.json";
import tr from "./tr.json";

addMessages("en", en);

addMessages("tr", tr);

init({ initialLocale: "en" });
