import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import { connectSocket, disconnectSocket } from "../services/socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("ttm_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("ttm_token"));
  const [booting, setBooting] = useState(true);

  const persistSession = useCallback((payload) => {
    setUser(payload.user);
    setToken(payload.token);
    localStorage.setItem("ttm_user", JSON.stringify(payload.user));
    localStorage.setItem("ttm_token", payload.token);
    connectSocket(payload.user._id);
  }, []);

  const refreshMe = useCallback(async () => {
    if (!localStorage.getItem("ttm_token")) {
      setBooting(false);
      return;
    }

    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
      localStorage.setItem("ttm_user", JSON.stringify(data.user));
      connectSocket(data.user._id);
    } catch {
      setUser(null);
      setToken(null);
    } finally {
      setBooting(false);
    }
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    persistSession(data);
    toast.success(`Welcome back, ${data.user.name}`);
  };

  const signup = async (values) => {
    const { data } = await api.post("/auth/signup", values);
    persistSession(data);
    toast.success("Account created");
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("ttm_user");
      localStorage.removeItem("ttm_token");
      setUser(null);
      setToken(null);
      disconnectSocket();
      toast.success("Signed out");
    }
  };

  const value = useMemo(
    () => ({ user, token, booting, isAdmin: user?.role === "Admin", login, signup, logout, setUser }),
    [user, token, booting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

