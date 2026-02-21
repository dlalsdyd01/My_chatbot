import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import { getMe, login as apiLogin, signup as apiSignup } from '../api/auth';
import type { User } from '../types/auth';
import { getToken, removeToken, setToken } from '../utils/token';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      getMe()
        .then(setUser)
        .catch(() => removeToken())
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    setToken(data.access_token);
    const me = await getMe();
    setUser(me);
  }, []);

  const signup = useCallback(async (username: string, email: string, password: string) => {
    await apiSignup({ username, email, password });
    await login(email, password);
  }, [login]);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
