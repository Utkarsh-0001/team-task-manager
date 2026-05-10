export const PRODUCTION_CLIENT_URL = "https://team-task-manager-seven-rho.vercel.app";
export const PRODUCTION_BACKEND_URL = "https://team-task-manager-34f2.onrender.com";

const normalizeOrigin = (value) => value.replace(/\/+$/, "");

const splitEnvList = (value = "") =>
  value
    .split(",")
    .map((item) => item.trim())
    .map(normalizeOrigin)
    .filter(Boolean);

export const getAllowedOrigins = () => {
  const configuredOrigins = [
    ...splitEnvList(process.env.CLIENT_URL),
    ...splitEnvList(process.env.FRONTEND_URL),
    ...splitEnvList(process.env.CORS_ORIGIN)
  ];

  return [...new Set([PRODUCTION_CLIENT_URL, ...configuredOrigins])];
};

export const getMongoUri = () => {
  const uri = (process.env.MONGO_URI || process.env.MONGODB_URI || "").trim();
  if (!uri) {
    throw new Error("MONGO_URI or MONGODB_URI is required");
  }

  return uri;
};

export const isSocketEnabled = () => process.env.ENABLE_SOCKET_IO === "true";
