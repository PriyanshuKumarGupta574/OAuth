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
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const isAuthenticated = Boolean(token);

 
  useEffect(() => {
    if (token) {
      API.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common.Authorization;
    }
  }, [token]);


  const login = (accessToken: string) => {
    localStorage.setItem("token", accessToken);
    setToken(accessToken);
  };


  const logout = async () => {
    try {
      await API.post("/auth/logout"); 
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
    }
  };

 
  const refreshToken = async () => {
    try {
      const res = await API.post("/auth/refresh-token");
      
      const newToken = res.data.accessToken;

      localStorage.setItem("token", newToken);
      setToken(newToken);
    } catch {
      await logout();
    }
  };

 
  useEffect(() => {
 
    if (token) return;

  
    refreshToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        login,
        logout,
        refreshToken,
      }}
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



