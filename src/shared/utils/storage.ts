export const APP_KEY = "battle-chess";
export const appStorage = {
  get: (key: string) => localStorage.getItem(`${APP_KEY}-${key}`),
  set: (key: string, val: string) =>
    localStorage.setItem(`${APP_KEY}-${key}`, val),
  clear: (keys: string[]) =>
    keys.forEach((k) => localStorage.removeItem(`${APP_KEY}-${k}`)),
};
