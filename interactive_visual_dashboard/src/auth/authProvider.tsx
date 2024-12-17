import React, { createContext, useContext, useEffect, useState } from "react";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

interface AuthContextType {
  username: string | null;
  accessToken: string | null;
  userPreferences: Record<string, string> | undefined;
  setAuthData: (data: { username: string; accessToken: string }) => void;
  logout: () => void;
  updatePreferences: (preferences: Record<string, string>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [username, setUsername] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userPreferences, setUserPreferences] = useState<
    Record<string, string> | undefined
  >(undefined);

  useEffect(() => {
    const savedAccessToken = cookies.get("accessToken");
    const savedUsername = cookies.get("username");
    const preferences = cookies.get("userPreferences");

    if (savedAccessToken && savedUsername) {
      setAccessToken(savedAccessToken);
      setUsername(savedUsername);
    }

    if (preferences) {
      setUserPreferences(JSON.parse(preferences));
    }
  }, []);

  const setAuthData = ({
    username,
    accessToken,
  }: {
    username: string;
    accessToken: string;
  }) => {
    setUsername(username);
    setAccessToken(accessToken);
    cookies.set("accessToken", accessToken, {
      path: "/",
      expires: new Date(Date.now() + 3600 * 1000),
    });
    cookies.set("username", username, { path: "/" });
  };

  const logout = () => {
    setUsername(null);
    setAccessToken(null);
    cookies.remove("accessToken", { path: "/" });
    cookies.remove("username", { path: "/" });
  };

  const updatePreferences = (preferences: Record<string, string>) => {
    setUserPreferences(preferences);
    cookies.set("userPreferences", JSON.stringify(preferences), { path: "/" });
  };

  return (
    <AuthContext.Provider
      value={{
        username,
        accessToken,
        userPreferences,
        setAuthData,
        logout,
        updatePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
