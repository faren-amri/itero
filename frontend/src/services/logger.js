export const logger = {
  info: (msg, ...args) => {
    if (process.env.NODE_ENV === "development") {
      console.info(`[INFO] ${msg}`, ...args);
    }
  },
  warn: (msg, ...args) => {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[WARN] ${msg}`, ...args);
    }
  },
  error: (msg, ...args) => {
    if (process.env.NODE_ENV === "development") {
      console.error(`[ERROR] ${msg}`, ...args);
    }
  },
};
