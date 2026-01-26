const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const fallbackApiUrl = import.meta.env.PROD
  ? "https://artify-u1jh.onrender.com"
  : "http://localhost:3000";

export const API_BASE_URL = 
  configuredApiUrl && configuredApiUrl !== "https://your-real-backend.com"
    ? configuredApiUrl.replace(/\/$/, "")
    : fallbackApiUrl;