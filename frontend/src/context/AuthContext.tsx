import {
  createContext,
  useContext,
  useEffect,
  useState,
   type ReactNode,
} from "react";
import API from "../services/api";

type AuthContextType = {
  token: string | null;
  login: (token: string) => void;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  /* ================= LOGIN ================= */
  const login = (accessToken: string) => {
    localStorage.setItem("token", accessToken);
    setToken(accessToken);
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    try {
      await API.post("/auth/logout"); // clears refresh cookie
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
    }
  };

  /* ================= REFRESH TOKEN ================= */
  const refreshToken = async () => {
    try {
      const res = await API.post("/auth/refresh-token");
      localStorage.setItem("token", res.data.accessToken);
      setToken(res.data.accessToken);
    } catch (err) {
      console.warn("Refresh token failed");
      logout();
    }
  };

  /* ================= AUTO REFRESH ON LOAD ================= */
  useEffect(() => {
    if (!token) {
      refreshToken();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, login, logout, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
