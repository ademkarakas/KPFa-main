import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from "react";
import { authApi } from "../services/api";

interface AdminUser {
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AdminUser | null>(null);

  // Load user data from localStorage on mount
  useEffect(() => {
    const checkStoredAuth = () => {
      const isAuth = authApi.isAuthenticated();
      setIsAuthenticated(isAuth);

      if (isAuth) {
        const email = localStorage.getItem("adminEmail");
        const name = localStorage.getItem("adminName");
        const role = localStorage.getItem("adminRole");

        if (email) {
          setUser({
            email,
            name: name || "Admin",
            role: role || "Administrator",
          });
        }
      } else {
        setUser(null);
      }
    };

    checkStoredAuth();

    // Check auth status periodically (every 5 minutes)
    const interval = setInterval(checkStoredAuth, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await authApi.login(email, password);

    setIsAuthenticated(true);
    setUser({
      email: response.email,
      name: response.name || "Admin",
      role: response.role,
    });

    // Store in localStorage
    localStorage.setItem("adminEmail", response.email);
    if (response.name) {
      localStorage.setItem("adminName", response.name);
    }
    localStorage.setItem("adminRole", response.role);
  };

  const logout = (): void => {
    authApi.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const checkAuth = (): boolean => {
    const isAuth = authApi.isAuthenticated();
    setIsAuthenticated(isAuth);

    if (!isAuth) {
      setUser(null);
    }

    return isAuth;
  };

  const value = useMemo<AuthContextType>(
    () => ({
      isAuthenticated,
      user,
      login,
      logout,
      checkAuth,
    }),
    [isAuthenticated, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
