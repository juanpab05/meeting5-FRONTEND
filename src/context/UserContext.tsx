import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchUserProfile } from "../api/user";
import { UserData } from "../schemas/user";
import { getToken } from "../api/utils";

interface UserContextType {
  user: UserData | null;
  guestUser: UserData;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  loadingUser: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const guestUser = ({
  _id:"guest",
  firstName: "guest",
  lastName: "",
  age: 0,
  email: "",
  password: "",
  createdAt: new Date(),
  updatedAt: new Date()
  });

  const [user, setUser] = useState<UserData | null>(guestUser);
  const [loadingUser, setLoadingUser] = useState(true);

  const fetchUser = async () => {
    if (getToken() !== null) {
      try {
        const response = await fetchUserProfile();
        if (response) {
          setUser({ ...response.data });
        } else {
          setUser(guestUser); // 👈 fallback si el perfil no existe
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(guestUser);
      } finally {
        setLoadingUser(false);
      }
    } else {
      setUser(guestUser);
      setLoadingUser(false);
    }
  };


  useEffect(() => {
    fetchUser();
  }, []);

  const refreshUser = async () => {
    setLoadingUser(true);
    try {
      await fetchUser();
    } catch (error: any) {
      if (error.message.includes("Recurso no encontrado")) {
        setUser(guestUser); // 👈 fallback automático
      }
    } finally {
      setLoadingUser(false);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, guestUser, setUser, loadingUser, refreshUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
