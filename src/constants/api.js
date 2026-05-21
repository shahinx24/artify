const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

export const API_BASE_URL =
  configuredApiUrl && configuredApiUrl !== "https://your-real-backend.com"
    ? configuredApiUrl.replace(/\/$/, "")
    : "http://localhost:3001";
