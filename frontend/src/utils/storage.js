const THEME_KEY = "scms.theme";

export const themeStorage = {
  get() {
    return localStorage.getItem(THEME_KEY) || "light";
  },
  set(value) {
    localStorage.setItem(THEME_KEY, value);
  },
};
