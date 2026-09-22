import { io } from "socket.io-client";

const resolveAuth = () => ({
  token: localStorage.getItem("token") || undefined
});

const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");
const isLocalhostUrl = (value = "") => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(value);
const productionSocketUrl = "https://api.ornaq.in";
const localSocketUrl = "http://localhost:5000";

const resolveSocketUrl = () => {
  const configuredUrl = import.meta.env.VITE_SOCKET_URL?.trim();
  if (configuredUrl) {
    const url = trimTrailingSlash(configuredUrl);
    if (import.meta.env.PROD && isLocalhostUrl(url)) {
      return productionSocketUrl;
    }
    return url;
  }

  const apiUrl = import.meta.env.VITE_API_URL?.trim();
  if (apiUrl) {
    const url = apiUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");
    if (import.meta.env.PROD && isLocalhostUrl(url)) {
      return productionSocketUrl;
    }
    return url;
  }

  return import.meta.env.DEV ? localSocketUrl : productionSocketUrl;
};

export const socket = io(resolveSocketUrl(), {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 10000,
  auth: resolveAuth()
});

export const connectSocket = () => {
  socket.auth = resolveAuth();
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected || socket.active) {
    socket.disconnect();
  }
};

export const syncSocketAuth = () => {
  socket.auth = resolveAuth();
  if (socket.connected) {
    socket.disconnect().connect();
  }
};
